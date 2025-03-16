import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import multipart from '@fastify/multipart'
import { memoriesRoutes } from './routes/vp/news'
import { authRoutes } from './routes/auth/auth'
import { authIgrejaRoutes } from './routes/auth/authIgreja'
import { uploadRoutes } from './routes/upload'
import { resolve } from 'node:path'
import { ministerioRoutes } from './routes/vp/ministerio'
import { agendaRoutes } from './routes/vp/agenda'
import { agendaRoutesCaxias } from './routes/caxias/agenda'
import { ministerioRoutesCaxias } from './routes/caxias/ministerio'
import { memoriesRoutesCaxias } from './routes/caxias/news'
import { agendaRoutesTomazinho } from './routes/tomazinho/agenda'
import { ministerioRoutesTomazinho } from './routes/tomazinho/ministerio'
import { memoriesRoutesTomazinho } from './routes/tomazinho/news'
import { doacaoRoutes } from './routes/doacao'
import { testemunhoRoutes } from './routes/testemunho'
import { enderecoRoutes } from './routes/endereco'
import { contatoRoutes } from './routes/contato'
import { sobreRoutes } from './routes/sobre'
import { sobreLiderRoutes } from './routes/sobreLider'

const app = fastify()

app.register(multipart)

app.register(require('@fastify/static'), {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
})

app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
})

app.register(jwt, {
  secret: 'alcancadospelagraca',
})

app.register(fastifyCookie)

app.register(authRoutes)
app.register(authIgrejaRoutes)
app.register(uploadRoutes)
app.register(memoriesRoutes)
app.register(ministerioRoutes)
app.register(agendaRoutes)
app.register(agendaRoutesCaxias)
app.register(ministerioRoutesCaxias)
app.register(memoriesRoutesCaxias)
app.register(agendaRoutesTomazinho)
app.register(ministerioRoutesTomazinho)
app.register(memoriesRoutesTomazinho)
app.register(doacaoRoutes)
app.register(enderecoRoutes)
app.register(testemunhoRoutes)
app.register(contatoRoutes)
app.register(sobreRoutes)
app.register(sobreLiderRoutes)

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333

app
  .listen({
    host: '0.0.0.0',
    port: PORT,
  })
  .then(() => {
    console.log(`🚀 HTTP server running on http://localhost:${PORT}`)
  })
