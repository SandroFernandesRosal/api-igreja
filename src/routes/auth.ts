import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request) => {
    const userSchema = z.object({
      login: z.string(),
      name: z.string(),
      avatarUrl: z.string().url(),
      password: z.string(),
    })
    try {
      const { login, name, avatarUrl, password } = userSchema.parse(
        request.body,
      )
      const senhaCriptografada = await bcrypt.hash(password, 10)

      const existingUser = await prisma.user.findUnique({
        where: {
          login,
        },
      })

      if (!bcrypt.compare(password, senhaCriptografada)) {
        return {
          error: `Senha incorreta.`,
        }
      }

      if (!existingUser) {
        const user = await prisma.user.create({
          data: {
            login,
            name,
            avatarUrl,
            password: senhaCriptografada,
          },
        })

        const token = app.jwt.sign(
          {
            name: user.name,
            avatarUrl: user.avatarUrl,
            login: user.login,
          },
          {
            sub: user.id,
            expiresIn: '30 days',
          },
        )
        return { token }
      } else {
        return { error: 'usuário já existe' }
      }
    } catch (error) {
      console.error(error)
      return { error: 'Erro ao criar usuário' }
    }
  })

  app.put('/register/:id', async (request, reply) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      name: z.string(),

      avatarUrl: z.string(),
      password: z.string(),
    })

    const { name, avatarUrl, password } = bodySchema.parse(request.body)

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,

        avatarUrl,
        password,
      },
    })

    return user
  })

  app.delete('/register/:id', async (request, reply) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.user.delete({
      where: {
        id,
      },
    })
  })
}
