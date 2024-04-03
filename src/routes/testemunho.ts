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

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    // Busca o usuário pelo ID do usuário autenticado
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
    })

    // Busca o testemunho pelo ID fornecido
    const testemunho = await prisma.testemunho.findUnique({
      where: { id },
      include: { userIgreja: true }, // Inclui o usuário que criou o testemunho
    })

    // Verifica se o testemunho existe
    if (!testemunho) {
      reply.code(404).send({
        error: 'Testemunho não encontrado.',
      })
      return
    }

    // Verifica se o usuário é o autor do testemunho ou um administrador
    if (!user || (!user.isAdmin && user.id !== testemunho.userIgreja.id)) {
      reply.code(403).send({
        error:
          'Acesso negado. Somente o autor do testemunho ou administradores podem apagar testemunhos.',
      })
      return
    }

    // Lógica para deletar o testemunho
    await prisma.testemunho.delete({
      where: {
        id,
      },
    })

    reply.send({ message: 'Testemunho deletado com sucesso.' })
  })
}
