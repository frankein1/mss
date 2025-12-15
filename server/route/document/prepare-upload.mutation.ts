import { createMutation } from '~/server/route'
import type { SecurityRuleContext } from '~/server/security/rules/types'
import type { ProtectedAppContext } from '~/server/trpc'
import { prepareUploadSchema, type PrepareUploadInput } from '~/server/schema'
import { getPresignedUrlForUpload } from '~/server/lib/s3/signed-url'
import { BeneficiaryRepo, DocumentRepo } from '~/server/database'
import { UserActivityType } from '@prisma/client'
import { FamilyFileService } from '~/server/services'
import {
  generateFilenameForDocument,
  generateFileRootForDocument
} from './helper'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: PrepareUploadInput
) => {
  try {
    await BeneficiaryRepo.findUniqueOrThrow(ctx.user, {
      select: { id: true },
      where: {
        id: input.beneficiaryId,
        familyFileId: input.familyFileId,
        structureId: ctx.structure.id
      }
    })
  } catch {
    // the beneficiary does not exist in the structure
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
  input: PrepareUploadInput
}) => {
  const filename = generateFilenameForDocument(input.file.name)
  const filepath = `${generateFileRootForDocument(ctx.structure.id, input.beneficiaryId)}/${filename}`

  // user asks for signed url for filename
  const config = useRuntimeConfig()
  const url = await getPresignedUrlForUpload(
    config.s3,
    filepath,
    input.file.mimeType,
    input.file.size,
    60
  )

  // create document preparation
  const { key } = await DocumentRepo.create(ctx.user, {
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
      name: filename,
      filenameDisk: filepath,
      filenameDownload: filepath,
      type: input.type,
      confidential: input.confidential,
      tags: input.tags,
      size: input.file.size,
      mimeType: input.file.mimeType,
      migrated: true // migrated to S3
    }
  })

  return { key, url }
}

export const prepareUpload = createMutation({
  inputValidation: prepareUploadSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'document.prepareUpload',
    target: 'Document',
    targetId: ({ routeResult }) => routeResult.key,
    action: UserActivityType.CREATE
  }
})
