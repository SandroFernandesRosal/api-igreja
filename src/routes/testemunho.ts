import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function testemunhoRoutes(app: FastifyInstance) {
  app.get('/testemunhos', async (request) => {
    const offsetQuery = (request.query as { offset?: string }).offset

    const offset = offsetQuery ? parseInt(offsetQuery, 10) : 0
    const itemsPerPage = 4

    const testemunho = await prisma.testemunho.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip: offset,
      take: itemsPerPage,
    })

    const testemunhoTotal = await prisma.testemunho.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { testemunho, testemunhoTotal }
  })

  app.get('/testemunhos/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const testemunho = await prisma.testemunho.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return testemunho
  })

  app.post('/testemunhos', async (request) => {
    await request.jwtVerify()

    const bodySchema = z.object({
      name: z.string(),
      coverUrl: z.string(),
      avatarUrl: z.string(),
      content: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { name, coverUrl, isPublic, avatarUrl, content } = bodySchema.parse(
      request.body,
    )

    const testemunho = await prisma.testemunho.create({
      data: {
        name,
        coverUrl,
        avatarUrl,
        content,
        isPublic,
        userId: request.user.sub,
      },
    })

    return testemunho
  })

  app.put('/testemunhos/:id', async (request, reply) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      name: z.string(),
      coverUrl: z.string(),
      avatarUrl: z.string(),
      content: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { name, coverUrl, isPublic, avatarUrl, content } = bodySchema.parse(
      request.body,
    )

    const testemunho = await prisma.testemunho.findUniqueOrThrow({
      where: {
        id,
      },
    })

    const isAdmin = await prisma.user.findUnique({
      where: { id: request.user.sub },
    })

    const isCreator = request.user.sub === testemunho.userId

    if (isAdmin || isCreator) {
      return await prisma.testemunho.update({
        where: {
          id,
        },
        data: {
          name,
          coverUrl,
          avatarUrl,
          content,
          isPublic,
        },
      })
    } else {
      reply.status(403).send({
        message: 'Você não tem permissão para deletar este testemunho.',
      })
    }
  })

  app.delete('/testemunhos/:id', async (request, reply) => {
    await request.jwtVerify()

    const { id } = z
      .object({
        id: z.string().uuid(),
      })
      .parse(request.params)

    const testemunho = await prisma.testemunho.findUniqueOrThrow({
      where: { id },
    })

    const isAdmin = await prisma.user.findUnique({
      where: { id: request.user.sub },
    })

    const isCreator = request.user.sub === testemunho.userId

    if (isAdmin || isCreator) {
      await prisma.testemunho.delete({ where: { id } })
      reply.send({ message: 'Testemunho deletado com sucesso.' })
    } else {
      reply.status(403).send({
        message: 'Você não tem permissão para deletar este testemunho.',
      })
    }
  })
}
