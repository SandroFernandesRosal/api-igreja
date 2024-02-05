import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

export async function agendaRoutes(app: FastifyInstance) {
  app.get('/agenda/viladapenha', async (request) => {
    const agendas = await prisma.agenda.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return agendas.map((agenda) => {
      return {
        id: agenda.id,
        name: agenda.name,
        day: agenda.day,
        hour: agenda.hour,
        createdAt: agenda.createdAt,
      }
    })
  })

  app.get('/agenda/viladapenha/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const agenda = await prisma.agenda.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (!agenda.isPublic && agenda.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    return agenda
  })

  app.post('/agenda/viladapenha', async (request) => {
    await request.jwtVerify()

    const bodySchema = z.object({
      name: z.string(),
      day: z.string(),
      hour: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { name, day, isPublic, hour } = bodySchema.parse(request.body)

    const agenda = await prisma.agenda.create({
      data: {
        name,
        day,
        hour,
        isPublic,
        userId: request.user.sub,
      },
    })

    return agenda
  })

  app.put('/agenda/viladapenha/:id', async (request, reply) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      name: z.string(),
      day: z.string(),
      hour: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { name, day, isPublic, hour } = bodySchema.parse(request.body)

    let agenda = await prisma.agenda.findUniqueOrThrow({
      where: {
        id,
      },
    })

    agenda = await prisma.agenda.update({
      where: {
        id,
      },
      data: {
        name,
        day,
        hour,
        isPublic,
      },
    })

    return agenda
  })

  app.delete('/agenda/viladapenha/:id', async (request, reply) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.agenda.findUniqueOrThrow({
      where: {
        id,
      },
    })

    await prisma.agenda.delete({
      where: {
        id,
      },
    })
  })
}
