import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

export async function ministerioRoutesCaxias(app: FastifyInstance) {
  app.get('/ministerio/caxias', async (request) => {
    const ministerios = await prisma.ministerioCaxias.findMany({
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
        coverUrl: ministerio.coverUrl,
      }
    })
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

    if (!ministerio.isPublic && ministerio.userId !== request.user.sub) {
      return reply.status(401).send()
    }

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
