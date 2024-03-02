import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function doacaoRoutes(app: FastifyInstance) {
  app.get('/doacao', async (request) => {
    const doacoes = await prisma.doacao.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return doacoes.map((doacao) => {
      return {
        id: doacao.id,
        local: doacao.local,
        banco: doacao.banco,
        conta: doacao.conta,
        agencia: doacao.agencia,
        nomebanco: doacao.nomebanco,
        pix: doacao.pix,
        nomepix: doacao.nomepix,
        createdAt: doacao.createdAt,
        updatedAt: doacao.updatedAt,
      }
    })
  })

  app.get('/doacao/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const doacao = await prisma.doacao.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return doacao
  })

  app.post('/doacao', async (request) => {
    await request.jwtVerify()

    const bodySchema = z.object({
      local: z.string(),
      banco: z.string(),
      conta: z.string(),
      agencia: z.string(),
      nomebanco: z.string(),
      pix: z.string(),
      nomepix: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { local, banco, conta, agencia, nomebanco, pix, nomepix, isPublic } =
      bodySchema.parse(request.body)

    const doacao = await prisma.doacao.create({
      data: {
        local,
        banco,
        conta,
        agencia,
        nomebanco,
        pix,
        nomepix,
        isPublic,
        userId: request.user.sub,
      },
    })

    return doacao
  })

  app.put('/doacao/:id', async (request, reply) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      local: z.string(),
      banco: z.string(),
      conta: z.string(),
      agencia: z.string(),
      nomebanco: z.string(),
      pix: z.string(),
      nomepix: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { local, banco, conta, agencia, nomebanco, pix, nomepix, isPublic } =
      bodySchema.parse(request.body)

    let doacao = await prisma.doacao.findUniqueOrThrow({
      where: {
        id,
      },
    })

    doacao = await prisma.doacao.update({
      where: {
        id,
      },
      data: {
        local,
        banco,
        conta,
        agencia,
        nomebanco,
        pix,
        nomepix,
        isPublic,
      },
    })

    return doacao
  })

  app.delete('/doacao/:id', async (request, reply) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.doacao.findUniqueOrThrow({
      where: {
        id,
      },
    })

    await prisma.doacao.delete({
      where: {
        id,
      },
    })
  })
}
