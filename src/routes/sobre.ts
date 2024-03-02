import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function sobreRoutes(app: FastifyInstance) {
  app.get('/sobre', async (request) => {
    const memories = await prisma.sobre.findMany({
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
        updatedAt: memory.updatedAt,
      }
    })
  })

  app.get('/sobre/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.sobre.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return memory
  })

  app.get('/sobre/search', async (request) => {
    const paramsSchema = z.object({
      search: z.string(),
    })

    try {
      const { search } = paramsSchema.parse(request.query)

      if (!search) {
        throw new Error('Query parameter is missing')
      }

      const memories = await prisma.sobre.findMany({
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
          updatedAt: memory.updatedAt,
        }
      })
    } catch (error) {
      // Trate o erro de maneira apropriada, como retornar um código de erro HTTP 500
      return { error: 'Internal Server Error' }
    }
  })

  app.post('/sobre', async (request) => {
    await request.jwtVerify()

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      title: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic, title } = bodySchema.parse(
      request.body,
    )

    const memory = await prisma.sobre.create({
      data: {
        content,
        coverUrl,
        title,
        isPublic,
        userId: request.user.sub,
      },
    })

    return memory
  })

  app.put('/sobre/:id', async (request, reply) => {
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
    })

    const { content, coverUrl, isPublic, title } = bodySchema.parse(
      request.body,
    )

    let memory = await prisma.sobre.findUniqueOrThrow({
      where: {
        id,
      },
    })

    memory = await prisma.sobre.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        title,
        isPublic,
      },
    })

    return memory
  })

  app.delete('/sobre/:id', async (request, reply) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.sobre.findUniqueOrThrow({
      where: {
        id,
      },
    })

    await prisma.sobre.delete({
      where: {
        id,
      },
    })
  })
}
