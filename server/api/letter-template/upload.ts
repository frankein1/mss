import { defineEventHandler, readMultipartFormData } from 'h3'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { forbidden, badrequest } from '~/utils/api/errors'
import { prismaClient } from '~/server/prisma'
import { uploadPlain } from '~/server/lib/s3/file'

const DOCX_MIME =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
const MAX_SIZE_BYTES = 20 * 1024 * 1024 // 20 MB

const inputSchema = z.object({ name: z.string().min(1).max(200) })

export default defineEventHandler(async event => {
  const user = event.context.auth?.user
  if (!user || user.status !== 'Active' || !user.structureId) {
    throw forbidden('upload: not authorized')
  }

  const multipart = await readMultipartFormData(event)
  if (!multipart?.length) {
    throw badrequest('Données manquantes')
  }

  const namePart = multipart.find(p => p.name === 'name')
  const filePart = multipart.find(p => p.name === 'file')

  if (!namePart || !filePart) {
    throw badrequest('Champs requis manquants (name, file)')
  }

  const parsed = inputSchema.safeParse({ name: namePart.data.toString() })
  if (!parsed.success) {
    throw badrequest('Nom du modèle invalide')
  }

  if (filePart.data.length > MAX_SIZE_BYTES) {
    throw badrequest('Fichier trop volumineux (max 20 Mo)')
  }

  if (filePart.type !== DOCX_MIME && !filePart.filename?.endsWith('.docx')) {
    throw badrequest('Seuls les fichiers .docx sont acceptés')
  }

  const config = useRuntimeConfig()
  const templateId = randomUUID()

  let s3Key: string | null = null

  if (config.document.useS3Storage) {
    s3Key = `letter-templates/${user.structureId}/${templateId}.docx`
    await uploadPlain(config as any, s3Key, filePart.data)
  }

  await prismaClient.letterTemplate.create({
    data: {
      id: templateId,
      name: parsed.data.name,
      s3Key,
      structureId: user.structureId,
      createdById: user.id,
      ...(!s3Key && {
        letterTemplateContent: {
          create: { content: filePart.data }
        }
      })
    }
  })

  return { id: templateId }
})
