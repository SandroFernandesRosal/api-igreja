import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    userIgreja: {
      id: string
      sub: string
      name: string
      avatarUrl: string
      password: string
      login: string
    }
  }
}
