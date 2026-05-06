import { defineEventHandler, setHeader, send } from 'h3'
import { forbidden, badrequest } from '~/utils/api/errors'
import { prismaClient } from '~/server/prisma'
import { downloadPlain } from '~/server/lib/s3/file'

export default defineEventHandler(async event => {
  const user = event.context.auth?.user
  if (!user || user.status !== 'Active' || !user.structureId) {
    throw forbidden('not authorized')
  }

  const id = event.context.params?.id
  if (!id) {throw badrequest('id manquant')}

  const template = await prismaClient.letterTemplate.findFirst({
    where: { id, structureId: user.structureId },
    select: {
      id: true,
      name: true,
      s3Key: true,
      letterTemplateContent: { select: { content: true } }
    }
  })

  if (!template) {throw forbidden('Modèle introuvable')}

  let fileBuffer: Buffer | null = null

  if (template.s3Key) {
    const config = useRuntimeConfig()
    fileBuffer = await downloadPlain(config as any, template.s3Key)
  } else if (template.letterTemplateContent?.content) {
    fileBuffer = Buffer.from(template.letterTemplateContent.content)
  }

  if (!fileBuffer) {throw badrequest('Fichier introuvable')}

  const filename = encodeURIComponent(`${template.name}.docx`)
  setHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`)
  setHeader(
    event,
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  )

  return send(event, fileBuffer)
})
