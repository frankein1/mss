import { defineEventHandler, readMultipartFormData } from 'h3'
import { Document, NotificationType } from '@prisma/client'
import { v4 } from 'uuid'
import { AddDocumentInput, addDocumentSchema } from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import { uploadFile } from '~/server/lib/s3'
import { forbiddenError, invalidError } from '~/server/trpc'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { canAddBeneficiaryDocument } from '~/server/security/rules'
import { JwtUser } from '~/types/user'
import { MultiPartData } from '~/server/lib/s3/types'

export default defineEventHandler(async event => {
  const { user } = event.context.auth
  if (!user) {
    throw forbiddenError()
  }
  const multipartFormData = await readMultipartFormData(event)
  if (!multipartFormData) {
    throw invalidError()
  }
  const data = getFormData(multipartFormData)
  if (!data) {
    throw invalidError('No beneficiary')
  }

  const input = addDocumentSchema.parse(data)

  const beneficiary = await getBeneficiarySecurityTarget(input.beneficiaryId)

  if (!beneficiary) {
    throw invalidError('No beneficiary')
  }

  if (!canAddBeneficiaryDocument(user, beneficiary)) {
    throw forbiddenError()
  }

  if (!multipartFormData?.length) {
    throw invalidError('No multipart form data')
  }

  const file = multipartFormData[0]

  const key = await uploadFile(file)

  const document = await addDocument(key, input, user)
  await addNotification(document, beneficiary.referents, beneficiary.id)

  return send(event, key)
})

async function addNotification(
  document: Document,
  referents: { id: string }[],
  beneficiaryId: string
) {
  const notifications = []
  for (const referent of referents) {
    if (document.createdById !== referent.id) {
      notifications.push({
        recipientId: referent.id,
        beneficiaryId,
        documentId: document.key,
        type: NotificationType.NewDocument
      })
    }
  }
  await prismaClient.notification.createMany({ data: notifications })
}

async function addDocument(
  key: string,
  input: AddDocumentInput,
  user: JwtUser
) {
  const { type, beneficiaryId, confidential, tags, file } = input
  const document = await prismaClient.document.create({
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
