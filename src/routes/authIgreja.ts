import 'dotenv/config'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

const nodemailer = require('nodemailer')

// Configuração do transporte do Nodemailer para o Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: true,
  auth: {
    user: 'apg.adm.viladapenha@gmail.com', // Substitua pelo seu e-mail do Gmail
    pass: process.env.PASSWORD_GMAIL, // Substitua pela sua senha do Gmail
  },
})

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
          id: user.id,
        },
      })

      const token = app.jwt.sign(
        {
          id: user.id,
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

  app.post('/recover-password', async (request, reply) => {
    const userSchema = z.object({
      login: z.string().email({ message: 'Email inválido' }),
    })
    const { login } = userSchema.parse(request.body)

    // Verifique se o e-mail existe no banco de dados
    const user = await prisma.userIgreja.findUnique({
      where: { login },
    })

    if (!user) {
      return { error: 'E-mail não encontrado' }
    }

    // Gere um token de recuperação de senha
    const token = uuidv4()

    // Armazene o token no banco de dados (exemplo simplificado)
    await prisma.passwordResetTokenIgreja.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 3600000), // Expira em 1 hora
      },
    })

    // Opções do e-mail
    const mailOptions = {
      from: 'apg.adm.viladapenha@gmail.com', // Substitua pelo seu e-mail do Gmail
      to: login, // E-mail do usuário
      subject: 'Recuperação de Senha',
      text: `Para redefinir sua senha, clique no link abaixo:
      https://alcancadospelagraca.vercel.app/reset-password?token=${token}
       Este link expira em 1 hora.`,
    }

    // Envie o e-mail
    transporter.sendMail(mailOptions, (err: any, info: any) => {
      if (err) {
        console.error('Erro ao enviar e-mail: ', err)
        reply
          .code(500)
          .send({ error: 'Erro ao enviar e-mail de recuperação de senha' })
      } else {
        console.log('E-mail enviado: ' + info.response)
        reply.send({ message: 'E-mail de recuperação de senha enviado' })
      }
    })
  })

  app.post('/register/igreja', async (request) => {
    const userSchema = z.object({
      login: z.string().email({ message: 'Email inválido' }),
      name: z.string(),
      avatarUrl: z.string().url(),
      password: z
        .string()
        .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
        .max(10, { message: 'A senha deve ter no máximo 10 caracteres' })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, {
          message: 'A senha deve conter pelo menos um caractere especial',
        })
        .refine((value) => /[a-zA-Z]/.test(value), {
          message: 'A senha deve conter pelo menos uma letra',
        }),
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
      if (error instanceof z.ZodError) {
        const erro = error.issues[0].message
        console.error(erro)

        return { erro }
      } else {
        console.error(error)
      }
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
      password: z
        .string()
        .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
        .max(10, { message: 'A senha deve ter no máximo 10 caracteres' })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, {
          message: 'A senha deve conter pelo menos um caractere especial',
        })
        .refine((value) => /[a-zA-Z]/.test(value), {
          message: 'A senha deve conter pelo menos uma letra',
        }),
    })

    try {
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
    } catch (error) {
      if (error instanceof z.ZodError) {
        const erro = error.issues[0].message
        console.error(erro)

        return { erro }
      } else {
        console.error(error)
      }
    }
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
