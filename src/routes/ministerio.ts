import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function ministerioRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/ministerio', async (request) => {
    const ministerios = await prisma.ministerio.findMany({
      where: {
        userId: request.user.sub,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return ministerios.map((ministerio) => {
      return {
        id: ministerio.id,
        name: ministerio.name,
        title: ministerio.title,
        local: ministerio.local,
        createdAt: ministerio.createdAt,
      }
    })
  })

  app.get('/minsterio/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const ministerio = await prisma.ministerio.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (!ministerio.isPublic && ministerio.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    return ministerio
  })

  app.post('/ministerio', async (request) => {
    const bodySchema = z.object({
      name: z.string(),
      title: z.string(),
      local: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { name, title, isPublic, local } = bodySchema.parse(request.body)

    const ministerio = await prisma.ministerio.create({
      data: {
        name,
        title,
        local,
        isPublic,
        userId: request.user.sub,
      },
    })

    return ministerio
  })

  app.put('/ministerio/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      name: z.string(),
      title: z.string(),
      local: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { name, title, isPublic, local } = bodySchema.parse(request.body)

    let ministerio = await prisma.ministerio.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (ministerio.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    ministerio = await prisma.ministerio.update({
      where: {
        id,
      },
      data: {
        name,
        title,
        local,
        isPublic,
      },
    })

    return ministerio
  })

  app.delete('/ministerio/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const ministerio = await prisma.ministerio.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (ministerio.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    await prisma.ministerio.delete({
      where: {
        id,
      },
    })
  })
}
