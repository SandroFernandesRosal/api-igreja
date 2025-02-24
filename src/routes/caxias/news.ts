import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

export async function memoriesRoutesCaxias(app: FastifyInstance) {
  app.get('/news/caxias', async (request) => {
    const offsetQuery = (request.query as { offset?: string }).offset

    const offset = offsetQuery ? parseInt(offsetQuery, 10) : 0
    const itemsPerPage = 1

    const news = await prisma.newCaxias.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip: offset,
      take: itemsPerPage,
    })

    return news
  })

  app.get('/news/caxias/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.newCaxias.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return memory
  })

  app.get('/news/caxias/search', async (request) => {
    const paramsSchema = z.object({
      search: z.string(),
    })

    try {
      const { search } = paramsSchema.parse(request.query)

      if (!search) {
        throw new Error('Query parameter is missing')
      }

      const memories = await prisma.newCaxias.findMany({
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

  app.post('/news/caxias', async (request) => {
    await request.jwtVerify()

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      title: z.string(),
      isPublic: z.coerce.boolean().default(false),
      destaque: z.coerce.boolean().default(false),
      page: z.string(),
    })

    const { content, coverUrl, isPublic, title, page, destaque } =
      bodySchema.parse(request.body)

    const memory = await prisma.newCaxias.create({
      data: {
        content,
        coverUrl,
        title,
        isPublic,
        userId: request.user.sub,
        page,
        destaque,
      },
    })

    return memory
  })

  app.put('/news/caxias/:id', async (request, reply) => {
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
      destaque: z.coerce.boolean().default(false),
      page: z.string(),
    })

    const { content, coverUrl, isPublic, title, page, destaque } =
      bodySchema.parse(request.body)

    let memory = await prisma.newCaxias.findUniqueOrThrow({
      where: {
        id,
      },
    })

    memory = await prisma.newCaxias.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        title,
        isPublic,
        page,
        destaque,
      },
    })

    return memory
  })

  app.delete('/news/caxias/:id', async (request, reply) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.newCaxias.findUniqueOrThrow({
      where: {
        id,
      },
    })

    await prisma.newCaxias.delete({
      where: {
        id,
      },
    })
  })
}
