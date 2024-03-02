import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

export async function agendaRoutesCaxias(app: FastifyInstance) {
  app.get('/agenda/caxias', async (request) => {
    const agendas = await prisma.agendaCaxias.findMany({
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
        updatedAt: agenda.updatedAt,
      }
    })
  })

  app.get('/agenda/caxias/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const agenda = await prisma.agendaCaxias.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return agenda
  })

  app.post('/agenda/caxias', async (request) => {
    await request.jwtVerify()

    const bodySchema = z.object({
      name: z.string(),
      day: z.string(),
      hour: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { name, day, isPublic, hour } = bodySchema.parse(request.body)

    const agenda = await prisma.agendaCaxias.create({
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

  app.put('/agenda/caxias/:id', async (request, reply) => {
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

    let agenda = await prisma.agendaCaxias.findUniqueOrThrow({
      where: {
        id,
      },
    })

    agenda = await prisma.agendaCaxias.update({
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

  app.delete('/agenda/caxias/:id', async (request, reply) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.agendaCaxias.findUniqueOrThrow({
      where: {
        id,
      },
    })

    await prisma.agendaCaxias.delete({
      where: {
        id,
      },
    })
  })
}
