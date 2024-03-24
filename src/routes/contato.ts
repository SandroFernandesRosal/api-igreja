import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function contatoRoutes(app: FastifyInstance) {
  app.get('/contato', async (request) => {
    const contatos = await prisma.contato.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return contatos
  })

  app.get('/contato/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const contato = await prisma.contato.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return contato
  })

  app.post('/contato', async (request) => {
    await request.jwtVerify()

    const bodySchema = z.object({
      local: z.string(),
      whatsapp: z.string(),
      instagran: z.string(),
      facebook: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { local, whatsapp, instagran, isPublic, facebook } = bodySchema.parse(
      request.body,
    )

    const contato = await prisma.contato.create({
      data: {
        local,
        whatsapp,
        instagran,
        facebook,
        isPublic,
        userId: request.user.sub,
      },
    })

    return contato
  })

  app.put('/contato/:id', async (request, reply) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      local: z.string(),
      whatsapp: z.string(),
      instagran: z.string(),
      facebook: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { local, whatsapp, instagran, isPublic, facebook } = bodySchema.parse(
      request.body,
    )

    let contato = await prisma.contato.findUniqueOrThrow({
      where: {
        id,
      },
    })

    contato = await prisma.contato.update({
      where: {
        id,
      },
      data: {
        local,
        whatsapp,
        instagran,
        facebook,
        isPublic,
      },
    })

    return contato
  })

  app.delete('/contato/:id', async (request, reply) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.contato.findUniqueOrThrow({
      where: {
        id,
      },
    })

    await prisma.contato.delete({
      where: {
        id,
      },
    })
  })
}
