import { defineEventHandler, readMultipartFormData } from 'h3'
import { Document, NotificationType, StructureType } from '@prisma/client'
import { v4 } from 'uuid'
import { AddDocumentInput, addDocumentSchema } from '~/server/schema'
import { uploadFile } from '~/server/lib/s3'
import { forbiddenError, invalidError } from '~/server/trpc'
import { JwtUser } from '~/types/user'
import { MultiPartData } from '~/server/lib/s3/types'
import { DocumentRepo, NotificationRepo } from '~/server/database'
import {
  BeneficiaryService,
  BeneficiarySecurityTarget
} from '~/server/services'
import { getDocumentPermissions } from '~/server/security'

export default defineEventHandler(async event => {
  const { user }: { user: JwtUser } = event.context.auth
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
    throw invalidError()
  }
  const data = getFormData(multipartFormData)
  if (!data) {
    return
  }

  let input
  try {
    input = addDocumentSchema.parse(data)
  } catch (e) {
    throw createError({
      statusCode: 400,
      message: 'Les données entrantes ne sont pas valides'
    })
  }

  const beneficiary = await BeneficiaryService.getBeneficiarySecurityTarget(
    user,
    input.beneficiaryId
  )

  if (!beneficiary) {
    throw invalidError('No beneficiary')
  }

  const structureType = user.structureType

  if (!structureType) {
    throw invalidError('No structure type')
  }

  const ctx = {
    user,
    structure: {
      id: user.structureId,
      type: structureType
    }
  }

  const permissions = await BeneficiaryService.getEditionPermissions(
    ctx,
    input.beneficiaryId
  )

  if (!permissions.create) {
    throw forbiddenError()
  }

  if (!multipartFormData?.length) {
    throw invalidError('No multipart form data')
  }

  const file = multipartFormData[0]

  const key = await uploadFile(file)

  const document = await addDocument(key, input, user)
  await addNotification(ctx.structure, document, beneficiary)

  return send(event, document.key)
})

async function addNotification(
  structure: {
    id: string
    type: StructureType
  },
  document: Document,
  beneficiary: NonNullable<BeneficiarySecurityTarget>
) {
  if (document.confidential) {
    return
  }
  const notifications = []
  for (const referent of beneficiary.referents) {
    const ctx = {
      user: referent,
      structure
    }
    const permissions = getDocumentPermissions({ ctx, beneficiary, document })
    if (document.createdById !== referent.id && permissions.view) {
      notifications.push({
        recipientId: referent.id,
        beneficiaryId: beneficiary.id,
        documentId: document.key,
        type: NotificationType.NewDocument,
        itemCreatedById: document.createdById
      })
    }
  }
  await NotificationRepo.prisma.createMany({ data: notifications })
}

async function addDocument(
  key: string,
  input: AddDocumentInput,
  user: JwtUser
) {
  const { type, beneficiaryId, confidential, tags, file } = input
  const document = await DocumentRepo.prisma.create({
    data: {
      key: v4(),
      name: file.name,
      filenameDisk: key,
      beneficiaryId,
      mimeType: file.mimeType,
      confidential,
      tags,
      createdById: user.id,
      type,
      size: file.size,
      filenameDownload: file.name
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
