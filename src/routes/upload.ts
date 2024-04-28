import { google } from 'googleapis'
import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'
import { FastifyInstance } from 'fastify'
import { GoogleAuth, OAuth2Client } from 'google-auth-library'
const GOOGLE_API_FOLDER_ID = '1G2Bg5Qs3t5jeB6DM0eZqMUVcwmSaGNzD'

export async function uploadRoutes(app: FastifyInstance) {
  const auth = new GoogleAuth({
    keyFile: './credentials.json',
    scopes: ['https://www.googleapis.com/auth/drive'],
  })

  const client = await auth.getClient()

  const oauth2Client = client as OAuth2Client

  app.post('/upload', async (request, reply) => {
    const upload = await request.file({
      limits: {
        fileSize: 5_242_880, //   5mb
      },
    })

    if (!upload) {
      return reply.status(400).send()
    }

    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)

    if (!isValidFileFormat) {
      return reply.status(400).send()
    }

    const fileId = randomUUID()
    const extension = extname(upload.filename)
    const fileName = fileId.concat(extension)

    const drive = google.drive({ version: 'v3', auth: oauth2Client })

    const fileMetadata = {
      name: fileName,
      parents: [GOOGLE_API_FOLDER_ID],
    }
    const media = {
      mimeType: upload.mimetype,
      body: upload.file,
    }
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id',
    })

    // Obtenha a URL do arquivo
    const fileUrl = `https://drive.google.com/uc?export=view&id=${response.data.id}`

    return { fileUrl }
  })

  app.post('/upload/sobre', async (request, reply) => {
    const upload = await request.file({
      limits: {
        fileSize: 50_000_000, //   50mb
      },
    })

    if (!upload) {
      return reply.status(400).send()
    }

    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)

    if (!isValidFileFormat) {
      return reply.status(400).send()
    }

    const fileId = randomUUID()
    const extension = extname(upload.filename)
    const fileName = fileId.concat(extension)

    const drive = google.drive({ version: 'v3', auth: oauth2Client })

    const fileMetadata = {
      name: fileName,
      parents: [GOOGLE_API_FOLDER_ID],
    }
    const media = {
      mimeType: upload.mimetype,
      body: upload.file,
    }
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id',
    })

    const fileUrl = `https://drive.google.com/uc?export=view&id=${response.data.id}`

    return { fileUrl }
  })
}
