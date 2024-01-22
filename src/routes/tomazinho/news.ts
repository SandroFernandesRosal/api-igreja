import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

export async function memoriesRoutesTomazinho(app: FastifyInstance) {
  app.get('/news/tomazinho', async (request) => {
    const memories = await prisma.newTomazinho.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })

    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        title: memory.title,
        content: memory.content,
        excerpt: memory.content.substring(0, 115).concat('...'),
        createdAt: memory.createdAt,
        page: memory.page,
      }
    })
  })

  app.get('/news/tomazinho/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.newTomazinho.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (!memory.isPublic && memory.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    return memory
  })

  app.get('/news/tomazinho/search', async (request) => {
    const paramsSchema = z.object({
      search: z.string(),
    })

    try {
      const { search } = paramsSchema.parse(request.query)

      if (!search) {
        throw new Error('Query parameter is missing')
      }

      const memories = await prisma.newTomazinho.findMany({
        where: {
          OR: [{ title: { contains: search } }],
        },
      })

      return memories.map((memory) => {
        return {
          id: memory.id,
          coverUrl: memory.coverUrl,
          title: memory.title,
          content: memory.content,
          excerpt: memory.content.substring(0, 115).concat('...'),
          createdAt: memory.createdAt,
          page: memory.page,
        }
      })
    } catch (error) {
      // Trate o erro de maneira apropriada, como retornar um código de erro HTTP 500
      return { error: 'Internal Server Error' }
    }
  })

  app.post('/news/tomazinho', async (request) => {
    await request.jwtVerify()

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      title: z.string(),
      isPublic: z.coerce.boolean().default(false),
      page: z.string(),
    })

    const { content, coverUrl, isPublic, title, page } = bodySchema.parse(
      request.body,
    )

    const memory = await prisma.newTomazinho.create({
      data: {
        content,
        coverUrl,
        title,
        isPublic,
        userId: request.user.sub,
        page,
      },
    })

    return memory
  })

  app.put('/news/tomazinho/:id', async (request, reply) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      title: z.string(),
      isPublic: z.coerce.boolean().default(false),
      page: z.string(),
    })

    const { content, coverUrl, isPublic, title, page } = bodySchema.parse(
      request.body,
    )

    let memory = await prisma.newTomazinho.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (memory.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    memory = await prisma.newTomazinho.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        title,
        isPublic,
        page,
      },
    })

    return memory
  })

  app.delete('/news/tomazinho/:id', async (request, reply) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.newTomazinho.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (memory.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    await prisma.newTomazinho.delete({
      where: {
        id,
      },
    })
  })
}
