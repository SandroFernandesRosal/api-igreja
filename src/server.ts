import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import { memoriesRoutes } from './routes/vp/news'
import { authRoutes } from './routes/auth'
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

const app = fastify()

app.register(multipart)

app.register(require('@fastify/static'), {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
})

app.register(cors, {
  origin: true,
})

app.register(jwt, {
  secret: 'alcancadospelagraca',
})

app.register(authRoutes)
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

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('🚀 HTTP server running on port http://localhost:3333')
  })
