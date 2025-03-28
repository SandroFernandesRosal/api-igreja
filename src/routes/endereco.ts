import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { prisma } from '../lib/prisma'

export async function enderecoRoutes(app: FastifyInstance) {
  app.get('/endereco', async (request) => {
    const enderecos = await prisma.endereco.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return enderecos
  })

  app.get('/endereco/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const endereco = await prisma.endereco.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return endereco
  })

  app.post('/endereco', async (request) => {
    await request.jwtVerify()

    const bodySchema = z.object({
      local: z.string(),
      rua: z.string(),
      cep: z.string(),
      numero: z.string(),
      cidade: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { local, rua, isPublic, cep, numero, cidade } = bodySchema.parse(
      request.body,
    )

    const endereco = await prisma.endereco.create({
      data: {
        local,
        rua,
        cep,
        numero,
        cidade,
        isPublic,
        userId: request.user.sub,
      },
    })

    return endereco
  })

  app.put('/endereco/:id', async (request, reply) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      local: z.string(),
      rua: z.string(),
      cep: z.string(),
      numero: z.string(),
      cidade: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { local, rua, isPublic, cep, numero, cidade } = bodySchema.parse(
      request.body,
    )

    let endereco = await prisma.endereco.findUniqueOrThrow({
      where: {
        id,
      },
    })

    endereco = await prisma.endereco.update({
      where: {
        id,
      },
      data: {
        local,
        rua,
        cep,
        numero,
        cidade,
        isPublic,
      },
    })

    return endereco
  })

  app.delete('/endereco/:id', async (request, reply) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.endereco.findUniqueOrThrow({
      where: {
        id,
      },
    })

    await prisma.endereco.delete({
      where: {
        id,
      },
    })
  })
}
