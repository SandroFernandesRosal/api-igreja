import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

export async function authRoutes(app: FastifyInstance) {
  app.get('/register', async (request) => {
    const users = await prisma.user.findMany()

    return users
  })

  app.get('/register/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return user
  })

  app.post('/login', async (request) => {
    const userSchema = z.object({
      login: z.string(),
      password: z.string(),
    })

    try {
      const { login, password } = userSchema.parse(request.body)

      const user = await authenticateUser(login, password)

      if (!user) {
        return { error: 'Credenciais inválidas.' }
      }

      const token = app.jwt.sign(
        {
          name: user.name,
          avatarUrl: user.avatarUrl,
          login: user.login,
        },
        {
          sub: user.id,
          expiresIn: '30d',
        },
      )

      return { user, token }
    } catch (error) {
      console.error(error)
      return { error: 'Erro na autenticação' }
    }
  })

  async function authenticateUser(login: string, password: any) {
    const user = await prisma.user.findUnique({
      where: {
        login,
      },
    })

    if (!user) {
      return false
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    return isPasswordValid ? user : false
  }

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

        return { user, token }
      } else {
        return { error: `Usuário ${login} já existe.` }
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

    const token = app.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl,
        login: user.login,
      },
      {
        sub: user.id,
        expiresIn: '30d',
      },
    )

    return { user, token }
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
