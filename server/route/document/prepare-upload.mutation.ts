import { createMutation } from '~/server/route'
import type { SecurityRuleContext } from '~/server/security/rules/types'
import type { ProtectedAppContext } from '~/server/trpc'
import { v4 } from 'uuid'
import { prepareUploadSchema, type PrepareUploadInput } from '~/server/schema'
import { getPresignedUrlForUploadWithPOST } from '~/server/lib/s3/signed-url'
import { BeneficiaryRepo, DocumentRepo } from '~/server/database'
import { UserActivityType } from '@prisma/client'
import { FamilyFileService } from '~/server/services'

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
  const filename = `${sanitizeFilename(input.file.name)}_${v4()}`
  const filepath = `${ctx.structure.id}/${input.beneficiaryId}/${filename}`

  // user asks for signed url for filename
  const config = useRuntimeConfig()
  const post = await getPresignedUrlForUploadWithPOST(config.s3, filename)

  // create document preparation
  const { key } = await DocumentRepo.create(ctx.user, {
    select: { key: true },
    data: {
      createdById: ctx.user.id,
      name: filename,
      filenameDisk: filepath,
      filenameDownload: filepath,
      familyFileId: input.familyFileId,
      beneficiaryId: input.beneficiaryId,
      type: input.type,
      confidential: input.confidential,
      tags: input.tags,
      size: input.file.size,
      mimeType: input.file.mimeType,
      migrated: true
    }
  })

  return {
    key,
    ...post
  }
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
