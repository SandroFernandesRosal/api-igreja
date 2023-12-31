import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function agendaRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/agenda', async (request) => {
    const agendas = await prisma.agenda.findMany({
      where: {
        userId: request.user.sub,
      },
      orderBy: {
        createdAt: 'asc',
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

  app.get('/agenda/:id', async (request, reply) => {
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

  app.post('/agenda', async (request) => {
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

  app.put('/agenda/:id', async (request, reply) => {
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

    if (agenda.userId !== request.user.sub) {
      return reply.status(401).send()
    }

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

  app.delete('/agenda/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const agenda = await prisma.agenda.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (agenda.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    await prisma.agenda.delete({
      where: {
        id,
      },
    })
  })
}
