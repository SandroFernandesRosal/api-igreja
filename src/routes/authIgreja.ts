import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

export async function authIgrejaRoutes(app: FastifyInstance) {
  app.get('/register/igreja', async (request) => {
    const users = await prisma.userIgreja.findMany()

    return users
  })

  app.get('/register/igreja/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const user = await prisma.userIgreja.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return user
  })

  app.post('/login/igreja', async (request) => {
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

      const refreshToken = uuidv4()

      await prisma.refreshTokenIgreja.create({
        data: {
          token: refreshToken,
          userId: user.id,
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

      return { user, token, refreshToken }
    } catch (error) {
      console.error(error)
      return { error: 'Erro na autenticação' }
    }
  })

  async function authenticateUser(login: string, password: any) {
    const user = await prisma.userIgreja.findUnique({
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

  app.post('/refresh-token/igreja', async (request, reply) => {
    const refreshTokenSchema = z.object({
      refreshToken: z.string(),
    })

    const { refreshToken } = refreshTokenSchema.parse(request.body)

    const refreshTokenRecord = await prisma.refreshTokenIgreja.findUnique({
      where: { token: refreshToken },
      include: { userIgreja: true },
    })

    if (!refreshTokenRecord) {
      return { error: 'Refresh token inválido.' }
    }

    const user = refreshTokenRecord.userIgreja

    const newToken = app.jwt.sign(
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

    return { token: newToken }
  })

  app.post('/register/igreja', async (request) => {
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

      const existingUser = await prisma.userIgreja.findUnique({
        where: { login },
      })

      if (existingUser) {
        return { error: `Usuário ${login} já existe.` }
      }

      const senhaCriptografada = await bcrypt.hash(password, 10)

      const refreshToken = uuidv4()

      const user = await prisma.userIgreja.create({
        data: {
          login,
          name,
          avatarUrl,
          password: senhaCriptografada,
        },
      })

      await prisma.refreshTokenIgreja.create({
        data: {
          token: refreshToken,
          userId: user.id,
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

      return { user, token, refreshToken }
    } catch (error) {
      console.error(error)
      return { error: 'Erro ao criar usuário' }
    }
  })

  app.put('/register/igreja/:id', async (request, reply) => {
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

    const senhaCriptografada = await bcrypt.hash(password, 10)

    const user = await prisma.userIgreja.update({
      where: {
        id,
      },
      data: {
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
        expiresIn: '30d',
      },
    )

    return { user, token }
  })

  app.delete('/register/igreja/:id', async (request) => {
    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.userIgreja.delete({
      where: {
        id,
      },
    })
  })
}
