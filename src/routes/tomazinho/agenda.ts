import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

export async function agendaRoutesTomazinho(app: FastifyInstance) {
  app.get('/agenda/tomazinho', async (request) => {
    const offsetQuery = (request.query as { offset?: string }).offset

    const offset = offsetQuery ? parseInt(offsetQuery, 10) : 0
    const itemsPerPage = 12

    const agenda = await prisma.agendaTomazinho.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip: offset,
      take: itemsPerPage,
    })

    return agenda
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
      destaque: z.coerce.boolean().default(false),
    })

    const { name, day, isPublic, hour, destaque } = bodySchema.parse(
      request.body,
    )

    const agenda = await prisma.agendaTomazinho.create({
      data: {
        name,
        day,
        hour,
        isPublic,
        userId: request.user.sub,
        destaque,
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
      destaque: z.coerce.boolean().default(false),
    })

    const { name, day, isPublic, hour, destaque } = bodySchema.parse(
      request.body,
    )

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
        destaque,
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
