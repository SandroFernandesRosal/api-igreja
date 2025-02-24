import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

export async function ministerioRoutesCaxias(app: FastifyInstance) {
  app.get('/ministerio/caxias', async (request) => {
    const offsetQuery = (request.query as { offset?: string }).offset

    const offset = offsetQuery ? parseInt(offsetQuery, 10) : 0
    const itemsPerPage = 12

    const ministerio = await prisma.ministerioCaxias.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip: offset,
      take: itemsPerPage,
    })

    return ministerio
  })

  app.get('/minsterio/caxias/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const ministerio = await prisma.ministerioCaxias.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return ministerio
  })

  app.post('/ministerio/caxias', async (request) => {
    await request.jwtVerify()

    const bodySchema = z.object({
      name: z.string(),
      title: z.string(),
      local: z.string(),
      isPublic: z.coerce.boolean().default(false),
      coverUrl: z.string(),
    })

    const { name, title, isPublic, local, coverUrl } = bodySchema.parse(
      request.body,
    )

    const ministerio = await prisma.ministerioCaxias.create({
      data: {
        name,
        title,
        local,
        isPublic,
        userId: request.user.sub,
        coverUrl,
      },
    })

    return ministerio
  })

  app.put('/ministerio/caxias/:id', async (request, reply) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      name: z.string(),
      title: z.string(),
      local: z.string(),
      isPublic: z.coerce.boolean().default(false),
      coverUrl: z.string(),
    })

    const { name, title, isPublic, local, coverUrl } = bodySchema.parse(
      request.body,
    )

    let ministerio = await prisma.ministerioCaxias.findUniqueOrThrow({
      where: {
        id,
      },
    })

    ministerio = await prisma.ministerioCaxias.update({
      where: {
        id,
      },
      data: {
        name,
        title,
        local,
        isPublic,
        coverUrl,
      },
    })

    return ministerio
  })

  app.delete('/ministerio/caxias/:id', async (request, reply) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.ministerioCaxias.findUniqueOrThrow({
      where: {
        id,
      },
    })

    await prisma.ministerioCaxias.delete({
      where: {
        id,
      },
    })
  })
}
