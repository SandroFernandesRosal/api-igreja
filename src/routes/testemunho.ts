import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function testemunhoRoutes(app: FastifyInstance) {
  app.get('/testemunhos', async (request) => {
    const memories = await prisma.testemunho.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return memories
  })

  app.get('/testemunhos/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.testemunho.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return memory
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

    const memory = await prisma.testemunho.create({
      data: {
        name,
        coverUrl,
        avatarUrl,
        content,
        isPublic,
        userId: request.user.sub,
      },
    })

    return memory
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

    let memory = await prisma.testemunho.findUniqueOrThrow({
      where: {
        id,
      },
    })

    memory = await prisma.testemunho.update({
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
    return memory
  })

  app.delete('/testemunhos/:id', async (request, reply) => {
    await request.jwtVerify()

    const userId = request.user.id // Assumindo que você tem o ID do usuário disponível aqui
    const isAdmin = request.user.isAdmin // E se ele é admin

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const testemunho = await prisma.testemunho.findUnique({
      where: {
        id,
      },
    })

    if (!testemunho) {
      return reply.status(404).send({ error: 'Testemunho não encontrado.' })
    }

    // Verifica se o usuário é admin ou é o criador do testemunho
    if (isAdmin || testemunho.userId === userId) {
      await prisma.testemunho.delete({
        where: {
          id,
        },
      })
      reply.status(200).send({ message: 'Testemunho deletado com sucesso.' })
    } else {
      reply
        .status(403)
        .send({ error: 'Você não tem permissão para deletar este testemunho.' })
    }
  })
}
