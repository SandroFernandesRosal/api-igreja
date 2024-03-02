import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

export async function ministerioRoutes(app: FastifyInstance) {
  app.get('/ministerio/viladapenha', async (request) => {
    const ministerios = await prisma.ministerio.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return ministerios.map((ministerio) => {
      return {
        id: ministerio.id,
        name: ministerio.name,
        title: ministerio.title,
        local: ministerio.local,
        createdAt: ministerio.createdAt,
        updatedAt: ministerio.updatedAt,
        coverUrl: ministerio.coverUrl,
      }
    })
  })

  app.get('/minsterio/viladapenha/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const ministerio = await prisma.ministerio.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return ministerio
  })

  app.post('/ministerio/viladapenha', async (request) => {
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

    const ministerio = await prisma.ministerio.create({
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

  app.put('/ministerio/viladapenha/:id', async (request, reply) => {
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

    let ministerio = await prisma.ministerio.findUniqueOrThrow({
      where: {
        id,
      },
    })

    ministerio = await prisma.ministerio.update({
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

  app.delete('/ministerio/viladapenha/:id', async (request, reply) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.ministerio.findUniqueOrThrow({
      where: {
        id,
      },
    })

    await prisma.ministerio.delete({
      where: {
        id,
      },
    })
  })
}
