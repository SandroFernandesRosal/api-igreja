import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/news/viladapenha', async (request) => {
    // Use uma asserção de tipo para informar ao TypeScript que request.query é um objeto com uma propriedade 'page'
    const pageQuery = (request.query as { page?: string }).page
    // Converte a string para um número, usando 1 como valor padrão se 'page' não estiver definido
    const page = pageQuery ? parseInt(pageQuery, 10) : 1
    const itemsPerPage = 4

    const memories = await prisma.new.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
    })

    return memories
  })

  app.get('/news/viladapenha/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.new.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return memory
  })

  app.get('/news/viladapenha/search', async (request) => {
    const paramsSchema = z.object({
      search: z.string(),
    })

    try {
      const { search } = paramsSchema.parse(request.query)

      if (!search) {
        throw new Error('Query parameter is missing')
      }

      const memories = await prisma.new.findMany({
        where: {
          OR: [{ title: { contains: search } }],
        },
      })

      return memories
    } catch (error) {
      // Trate o erro de maneira apropriada, como retornar um código de erro HTTP 500
      return { error: 'Internal Server Error' }
    }
  })

  app.post('/news/viladapenha', async (request) => {
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

    const memory = await prisma.new.create({
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

  app.put('/news/viladapenha/:id', async (request, reply) => {
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

    let memory = await prisma.new.findUniqueOrThrow({
      where: {
        id,
      },
    })

    memory = await prisma.new.update({
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

  app.delete('/news/viladapenha/:id', async (request, reply) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.new.findUniqueOrThrow({
      where: {
        id,
      },
    })

    await prisma.new.delete({
      where: {
        id,
      },
    })
  })
}
