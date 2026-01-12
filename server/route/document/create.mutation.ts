import { createMutation } from '~/server/route'
import type { CreateDocumentInput } from '~/server/schema'
import { createDocumentSchema } from '~/server/schema'
import { forbiddenError, type ProtectedAppContext } from '~/server/trpc'
import {
  getDocumentPermissions,
  type SecurityRuleContext
} from '~/server/security'
import {
  BeneficiaryRepo,
  DocumentRepo,
  NotificationRepo
} from '~/server/database'
import { FamilyFileService } from '~/server/services'
import { getSignedUrlForRead } from '~/server/lib/s3/signed-url'
import { NotificationType, UserActivityType } from '@prisma/client'
import { validateDocumentType } from '~/server/security/document/validate-document-type'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: CreateDocumentInput
) => {
  try {
    await BeneficiaryRepo.findUniqueOrThrow(ctx.user, {
      select: { id: true },
      where: { id: input.beneficiaryId, familyFileId: input.familyFileId }
    })
  } catch {
    return false
  }

  const permissions = await FamilyFileService.getEditionPermissions(
    ctx,
    input.familyFileId
  )

  return permissions.create.document
}

const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: CreateDocumentInput
}) => {
  const config = useRuntimeConfig()

  // Get presigned url for reading first bytes. You don't have to load the whole file in memory.
  // For validating a file uploaded to S3 using Lambda for example, it may be
  // enough to load the files first 100 bytes and validate against them.
  const nBytes = 100
  const url = await getSignedUrlForRead(config.s3, input.filepath, 60, nBytes)

  // Fetch decrypted document GET for first bytes validation
  console.log(url)
  const response = await fetch(url, { method: 'GET' })
  const bytes = await response.bytes()

  console.log('after buffer creation', bytes.length)

  if (!validateDocumentType(Buffer.from(bytes))) {
    // TODO delete document in S3
    throw forbiddenError('Invalid file format from document type analysis')
  }

  // Create document in DB
  const document = await DocumentRepo.create(ctx.user, {
    select: { key: true },
    data: {
      createdBy: {
        connect: { id: ctx.user.id }
      },
      familyFile: {
        connect: { id: input.familyFileId }
      },
      beneficiary: {
        connect: { id: input.beneficiaryId }
      },
      name: input.filename,
      filenameDisk: input.filepath,
      filenameDownload: input.filepath,
      type: input.type,
      confidential: input.confidential,
      tags: input.tags,
      size: input.file.size,
      mimeType: input.file.mimeType,
      migrated: true // migrated to S3
    }
  })

  await addNotification(ctx, document.key, input)

  return { key: document.key }
}

/** Send notification to all other referents except if document is confidential */
async function addNotification(
  ctx: SecurityRuleContext,
  key: string,
  input: CreateDocumentInput
) {
  const { confidential, beneficiaryId } = input

  if (confidential) {
    return
  }

  const familyFile = await FamilyFileService.getFamilyFileSecurityTarget(
    ctx.user,
    input.familyFileId
  )

  const notifications = []
  for (const referent of familyFile.referents) {
    const permissionCtx = {
      user: referent,
      structure: ctx.structure
    }
    const permissions = getDocumentPermissions({
      ctx: permissionCtx,
      familyFile,
      document: { confidential, createdById: ctx.user.id }
    })

    if (ctx.user.id !== referent.id && permissions.view) {
      notifications.push({
        recipientId: referent.id,
        beneficiaryId,
        documentId: key,
        type: NotificationType.NewDocument,
        itemCreatedById: ctx.user.id
      })
    }
  }
  await NotificationRepo.prisma.createMany({ data: notifications })
}

export const createDocumentMutation = createMutation({
  inputValidation: createDocumentSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'document.create',
    target: 'Document',
    targetId: ({ routeResult }) => routeResult.key,
    action: UserActivityType.CREATE
  }
})
