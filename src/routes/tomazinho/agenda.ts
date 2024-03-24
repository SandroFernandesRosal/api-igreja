import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

export async function agendaRoutesTomazinho(app: FastifyInstance) {
  app.get('/agenda/tomazinho', async (request) => {
    const agendas = await prisma.agendaTomazinho.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return agendas
  })

  app.get('/agenda/tomazinho/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const agenda = await prisma.agendaTomazinho.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return agenda
  })

  app.post('/agenda/tomazinho', async (request) => {
    await request.jwtVerify()

    const bodySchema = z.object({
      name: z.string(),
      day: z.string(),
      hour: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { name, day, isPublic, hour } = bodySchema.parse(request.body)

    const agenda = await prisma.agendaTomazinho.create({
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

  app.put('/agenda/tomazinho/:id', async (request, reply) => {
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

    let agenda = await prisma.agendaTomazinho.findUniqueOrThrow({
      where: {
        id,
      },
    })

    agenda = await prisma.agendaTomazinho.update({
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

  app.delete('/agenda/tomazinho/:id', async (request, reply) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.agendaTomazinho.findUniqueOrThrow({
      where: {
        id,
      },
    })

    await prisma.agendaTomazinho.delete({
      where: {
        id,
      },
    })
  })
}
