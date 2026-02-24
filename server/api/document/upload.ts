import { defineEventHandler, readMultipartFormData } from 'h3'
import type { Document } from '@prisma/client'
import { NotificationType, UserActivityType } from '@prisma/client'
import { v4 } from 'uuid'
import type { AddDocumentInput } from '~/server/schema'
import { addDocumentSchema } from '~/server/schema'
import { forbiddenError, invalidError } from '~/server/trpc'
import type { JwtUser } from '~/server/lib/jwt'
import { DocumentRepo, NotificationRepo } from '~/server/database'
import type { FamilyFileSecurityTarget } from '~/server/services'
import { FamilyFileService } from '~/server/services'
import type { SecurityRuleContext } from '~/server/security'
import { getDocumentPermissions } from '~/server/security'
import { sanitizeFilename } from '~/server/utils/sanitizeFilename'
import { validateDocumentType } from '~/server/security/document/validate-document-type'
import { updateBeneficiariesLastActivity } from '~/server/query/beneficiaryLastActivity/updateBeneficiariesLastActivity'
import { addUserActivity } from '~/server/query'

export interface MultiPartData {
  data: Buffer
  name?: string
  filename?: string
  type?: string
}

export default defineEventHandler(async event => {
  const user = event.context.auth?.user
  if (
    !user ||
    user.status !== 'Active' ||
    user.role === 'Administrator' ||
    !user.structureId
  ) {
    throw forbiddenError()
  }
  const multipartFormData = await readMultipartFormData(event)
  if (!multipartFormData) {
    throw createError({
      statusCode: 400,
      message: 'multipart form data non présent'
    })
  }
  const data = getFormData(multipartFormData)
  if (!data) {
    throw createError({
      statusCode: 400,
      message: 'Aucune donnée présente dans le multipart form data'
    })
  }

  let input
  try {
    input = addDocumentSchema.parse(data)
  } catch {
    throw createError({
      statusCode: 400,
      message: 'Les données entrantes ne sont pas valides'
    })
  }

  const familyFile = await FamilyFileService.getFamilyFileSecurityTarget(
    user,
    input.familyFileId
  )

  if (!familyFile) {
    throw createError({
      statusCode: 400,
      message: `Aucun foyer avec l'id ${input.familyFileId}`
    })
  }

  const structureType = user.structureType

  if (!structureType) {
    throw invalidError('No structure type')
  }

  const ctx = {
    user,
    structure: {
      id: user.structureId,
      type: structureType,
      externalRdvspActive: null
    }
  }

  const permissions = await FamilyFileService.getEditionPermissions(
    ctx,
    input.familyFileId
  )

  if (!permissions.create) {
    throw forbiddenError()
  }

  if (!multipartFormData?.length) {
    throw invalidError('No multipart form data')
  }

  const file = multipartFormData[0]

  if (!file || !validateDocumentType(file.data)) {
    throw createError({
      statusCode: 400,
      message: 'Format de fichier invalide'
    })
  }

  const document = await addDocument(input, user, file)
  await addNotification(ctx, document, familyFile, input.beneficiaryId)
  await updateBeneficiariesLastActivity([document.beneficiaryId])
  addUserActivity({
    key: 'document.upload',
    user,
    activity: UserActivityType.IMPORT,
    object: 'Document',
    objectId: document.key,
    content: null
  }).catch(error => console.error(error))

  return send(event, document.key)
})

async function addNotification(
  ctx: SecurityRuleContext,
  document: Document,
  familyFile: NonNullable<FamilyFileSecurityTarget>,
  beneficiaryId: string
) {
  if (document.confidential) {
    return
  }

  const notifications = []
  for (const referent of familyFile.referents) {
    const permissionCtx = {
      user: referent,
      structure: ctx.structure
    }
    const permissions = getDocumentPermissions({
      ctx: permissionCtx,
      familyFile,
      document
    })

    if (document.createdById !== referent.id && permissions.view) {
      notifications.push({
        recipientId: referent.id,
        beneficiaryId,
        documentId: document.key,
        type: NotificationType.NewDocument,
        itemCreatedById: document.createdById
      })
    }
  }
  await NotificationRepo.prisma.createMany({ data: notifications })
}

async function addDocument(
  input: AddDocumentInput,
  user: JwtUser,
  multipartFormData: MultiPartData
) {
  const key = v4()
  const { type, familyFileId, beneficiaryId, confidential, tags, file, expirationDate } = input
  const document = await DocumentRepo.prisma.create({
    data: {
      key,
      name: sanitizeFilename(file.name),
      familyFileId,
      beneficiaryId,
      filenameDisk: key,
      mimeType: file.mimeType,
      confidential,
      tags,
      createdById: user.id,
      type,
      size: file.size,
      filenameDownload: sanitizeFilename(file.name),
      migrated: true,
      expirationDate: expirationDate ?? null,
      documentContent: {
        create: {
          content: multipartFormData.data
        }
      }
    }
  })

  return document
}

function getFormData(multipartFormData: MultiPartData[]) {
  const values = multipartFormData?.find(el => el.name === 'input')
  if (!values) {
    return
  }
  return JSON.parse(values.data.toString())
}
