import { v2 as cloudinary } from 'cloudinary'
import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'
import { FastifyInstance } from 'fastify'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    try {
      const upload = await request.file({
        limits: {
          fileSize: 5_242_880, // 5mb
        },
      })

      if (!upload) {
        console.error('No file uploaded')
        return reply.status(400).send({ error: 'No file uploaded' })
      }

      const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/
      const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)

      if (!isValidFileFormat) {
        console.error('Invalid file format')
        return reply.status(400).send({ error: 'Invalid file format' })
      }

      const fileId = randomUUID()
      const extension = extname(upload.filename)
      const fileName = fileId.concat(extension)

      const fileBuffer = await upload.toBuffer()
      const result = await cloudinary.uploader.upload(
        `data:${upload.mimetype};base64,${fileBuffer.toString('base64')}`,
        {
          resource_type: 'auto',
          public_id: fileName,
          format: 'webp',
          transformation: [
            {
              width: 1200,
              height: 400,
              crop: 'pad',
              background: 'auto:border',
            },
          ],
        },
      )

      return { fileUrl: result.secure_url }
    } catch (error) {
      console.error('Error uploading file:', error)
      return reply.status(500).send({ error: 'Error uploading file' })
    }
  })

  app.post('/upload/sobre', async (request, reply) => {
    try {
      const upload = await request.file({
        limits: {
          fileSize: 50_000_000, // 50mb
        },
      })

      if (!upload) {
        console.error('No file uploaded')
        return reply.status(400).send({ error: 'No file uploaded' })
      }

      const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/
      const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)

      if (!isValidFileFormat) {
        console.error('Invalid file format')
        return reply.status(400).send({ error: 'Invalid file format' })
      }

      const fileId = randomUUID()
      const extension = extname(upload.filename)
      const fileName = fileId.concat(extension)

      const fileBuffer = await upload.toBuffer()
      const result = await cloudinary.uploader.upload(
        `data:${upload.mimetype};base64,${fileBuffer.toString('base64')}`,
        {
          resource_type: 'auto',
          public_id: fileName,
          format: 'webp',
        },
      )

      return { fileUrl: result.secure_url }
    } catch (error) {
      console.error('Error uploading file:', error)
      return reply.status(500).send({ error: 'Error uploading file' })
    }
  })
}
