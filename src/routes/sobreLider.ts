import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function sobreRoutes(app: FastifyInstance) {
  app.get('/sobre/lider', async (request) => {
    const memories = await prisma.sobreLider.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })

    return memories
  })

  app.get('/sobre/lider/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.sobreLider.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return memory
  })

  app.post('/sobre/lider', async (request) => {
    await request.jwtVerify()

    const bodySchema = z.object({
      name: z.string(),
      coverUrl: z.string(),
      title: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { name, coverUrl, isPublic, title } = bodySchema.parse(request.body)

    const memory = await prisma.sobreLider.create({
      data: {
        name,
        coverUrl,
        title,
        isPublic,
        userId: request.user.sub,
      },
    })

    return memory
  })

  app.put('/sobre/lider/:id', async (request, reply) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      name: z.string(),
      coverUrl: z.string(),
      title: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { name, coverUrl, isPublic, title } = bodySchema.parse(request.body)

    let memory = await prisma.sobreLider.findUniqueOrThrow({
      where: {
        id,
      },
    })

    memory = await prisma.sobreLider.update({
      where: {
        id,
      },
      data: {
        name,
        coverUrl,
        title,
        isPublic,
      },
    })

    return memory
  })

  app.delete('/sobre/lider/:id', async (request, reply) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.sobreLider.findUniqueOrThrow({
      where: {
        id,
      },
    })

    await prisma.sobreLider.delete({
      where: {
        id,
      },
    })
  })
}
