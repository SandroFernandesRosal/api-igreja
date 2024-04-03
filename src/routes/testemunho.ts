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

    const { id } = z
      .object({
        id: z.string().uuid(),
      })
      .parse(request.params)

    // Encontre o testemunho para obter o userId relacionado a ele
    const testemunho = await prisma.testemunho.findUniqueOrThrow({
      where: { id },
    })

    // Verifica se o usuário é um administrador ou o criador do testemunho
    const isAdmin = request.user.isAdmin // Isso deve ser determinado pelo seu sistema de autenticação
    const isCreator = request.user.sub === testemunho.userId

    // Se o usuário é administrador ou o criador do testemunho, permita a deleção
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
