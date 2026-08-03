import { defineEventHandler, readMultipartFormData } from 'h3'
import type { Document } from '@prisma/client'
import { NotificationType, UserActivityType } from '@prisma/client'
import type { AddDocumentInput } from '~/server/schema'
import { addDocumentSchema } from '~/server/schema'
import { DocumentRepo, NotificationRepo } from '~/server/database'
import type { FamilyFileSecurityTarget } from '~/server/services'
import { BeneficiaryService, FamilyFileService } from '~/server/services'
import type { SecurityRuleContext } from '~/server/security'
import { getDocumentPermissions } from '~/server/security'
import { sanitizeFilename } from '~/server/utils/sanitizeFilename'
import { validateDocumentType } from '~/server/security/document/validate-document-type'
import { updateBeneficiariesLastActivity } from '~/server/query/beneficiaryLastActivity/updateBeneficiariesLastActivity'
import { addUserActivity } from '~/server/query'
import type { RuntimeConfig } from 'nuxt/schema'
import { forbidden, badrequest } from '~/utils/api/errors'
import { randomUUID } from 'node:crypto'
import { generateBucketKeyForDocument } from '~/server/lib/s3/helper'
import { deleteFile, uploadWithEncryption } from '~/server/lib/s3/file'
import { fetchUserContext } from '~/server/utils/fetchUserContext'
import type { UserContext } from '~/server/utils/fetchUserContext'
import { checkUserIsAuthenticated } from '~/server/utils/checkUserIsAuthenticated'

export interface MultiPartData {
  data: Buffer
  name?: string
  filename?: string
  type?: string
}

export default defineEventHandler(async event => {
  const userId = event.context.auth?.userId
  if (!userId) {
    throw forbidden('upload: not authorized')
  }

  const user = await fetchUserContext(userId)
  checkUserIsAuthenticated(user)

  if (!user.structure) {
    throw forbidden('upload: not authorized')
  }

  const multipartFormData = await readMultipartFormData(event)
  if (!multipartFormData) {
    throw badrequest('multipart form data non présent')
  }
  const data = getFormData(multipartFormData)
  if (!data) {
    throw badrequest(
      'upload: Aucune donnée présente dans le multipart form data'
    )
  }

  let input
  try {
    input = addDocumentSchema.parse(data)
  } catch {
    throw badrequest('upload: Les données entrantes ne sont pas valides')
  }

  const { familyFile, ...beneficiary } =
    await BeneficiaryService.getBeneficiarySecurityTarget(
      user,
      input.beneficiaryId
    )

  const ctx = {
    user,
    structure: user.structure
  }

  const permissions = await FamilyFileService.getEditionPermissions(
    ctx,
    familyFile.id
  )

  if (!permissions.create.document) {
    throw forbidden('upload: not authorized')
  }

  if (!multipartFormData?.length) {
    throw badrequest('upload: No multipart form data')
  }

  const file = multipartFormData[0]

  if (!file || !validateDocumentType(file.data)) {
    throw badrequest('upload: Format de fichier invalide')
  }

  const document = await createDocument(
    beneficiary.id,
    familyFile.id,
    input,
    user,
    file
  )

  await addNotification(ctx, document, familyFile, beneficiary.id)
  await updateBeneficiariesLastActivity([beneficiary.id])
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

async function createDocument(
  beneficiaryId: string,
  familyFileId: string,
  input: Omit<AddDocumentInput, 'beneficiaryId'>,
  user: UserContext,
  file: MultiPartData
) {
  const config = useRuntimeConfig()
  if (config.document.useS3Storage) {
    return await uploadEncryptedToS3({
      beneficiaryId,
      familyFileId,
      config,
      input,
      user,
      file
    })
  }

  return await uploadToDb({ beneficiaryId, familyFileId, input, user, file })
}

async function addNotification(
  ctx: SecurityRuleContext,
  document: Pick<
    Document,
    'key' | 'confidential' | 'createdById' | 'confidential'
  >,
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

interface UploadDbArgs {
  beneficiaryId: string
  familyFileId: string
  input: Omit<AddDocumentInput, 'beneficiaryId'>
  user: UserContext
  file: MultiPartData
}
async function uploadToDb({
  beneficiaryId,
  familyFileId,
  input,
  user,
  file
}: UploadDbArgs) {
  const key = randomUUID()
  const filename = sanitizeFilename(input.file.name)
  const { type, confidential, tags, expirationDate } = input
  const document = await DocumentRepo.create(user, {
    select: {
      key: true,
      confidential: true,
      createdById: true
    },
    data: {
      key,
      name: filename,
      familyFile: { connect: { id: familyFileId } },
      beneficiary: { connect: { id: beneficiaryId } },
      filenameDisk: key,
      mimeType: input.file.mimeType,
      confidential,
      tags,
      createdBy: { connect: { id: user.id } },
      type,
      size: input.file.size,
      filenameDownload: filename,
      migrated: false, // stored in db
      expirationDate: expirationDate ?? null,
      documentContent: {
        create: {
          content: file.data as Uint8Array<ArrayBuffer>
        }
      }
    }
  })

  return document
}

interface UploadEncryptedS3Args {
  beneficiaryId: string
  familyFileId: string
  config: Pick<RuntimeConfig, 'document' | 's3' | 'kms' | 'public'>
  input: Omit<AddDocumentInput, 'beneficiaryId'>
  user: UserContext
  file: MultiPartData
}
async function uploadEncryptedToS3({
  beneficiaryId,
  familyFileId,
  config,
  input,
  user,
  file
}: UploadEncryptedS3Args) {
  const documentKey = randomUUID()
  const bucketKey = generateBucketKeyForDocument(documentKey)
  const filename = sanitizeFilename(input.file.name)

  const { encryptedDataKey } = await uploadWithEncryption({
    config,
    bucketKey,
    plainData: file.data,
    dataForEncryptionContext: {
      documentKey
    }
  })

  try {
    // FIXME: add retry for this in case of temporary db indispo
    const document = await DocumentRepo.create(user, {
      select: {
        key: true,
        confidential: true,
        createdById: true
      },
      data: {
        key: documentKey,
        createdBy: { connect: { id: user.id } },
        familyFile: { connect: { id: familyFileId } },
        beneficiary: { connect: { id: beneficiaryId } },
        name: filename,
        filenameDisk: bucketKey,
        filenameDownload: filename,
        type: input.type,
        confidential: input.confidential,
        tags: input.tags,
        size: input.file.size,
        mimeType: input.file.mimeType,
        expirationDate: input.expirationDate ?? null,
        encryptedDataKey,
        migrated: true // migrated to S3
      }
    })
    return document
  } catch (e) {
    // If storing the document data in DB fails the document content won't be readable
    // So it is cleaned and an error is sent.
    await deleteFile(config, bucketKey).catch(s3e =>
      console.error(`upload: cleanup failed for ${bucketKey}`, s3e)
    )
    throw e
  }
}

function getFormData(multipartFormData: MultiPartData[]) {
  const values = multipartFormData?.find(el => el.name === 'input')
  if (!values) {
    return
  }
  return JSON.parse(values.data.toString())
}
