import { createQuery } from '~/server/route'
import type { GetUploadPresignedUrlInput } from '~/server/schema'
import { getUploadPresignedUrlSchema } from '~/server/schema'
import type { ProtectedAppContext } from '~/server/trpc'
import type { SecurityRuleContext } from '~/server/security'
import { BeneficiaryRepo } from '~/server/database'
import { FamilyFileService } from '~/server/services'
import { getPresignedUrlForUpload } from '~/server/lib/s3/signed-url'
import {
  generateFilenameForDocument,
  generateFileRootForDocument
} from './helper'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: GetUploadPresignedUrlInput
) => {
  const ben = await BeneficiaryRepo.findUniqueOrThrow(ctx.user, {
    select: { familyFileId: true },
    where: { id: input.beneficiaryId }
  })

  const permissions = await FamilyFileService.getEditionPermissions(
    ctx,
    ben.familyFileId
  )

  return permissions.create.document
}

const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: GetUploadPresignedUrlInput
}) => {
  const filename = generateFilenameForDocument(input.file.name)
  const filepath = `${generateFileRootForDocument(ctx.structure.id, input.beneficiaryId)}/${filename}`

  const config = useRuntimeConfig()
  const url = await getPresignedUrlForUpload(
    config.s3,
    filepath,
    input.file.mimeType,
    input.file.size
  )

  return { url, filename, filepath }
}

export const getUploadPresignedUrlQuery = createQuery({
  inputValidation: getUploadPresignedUrlSchema,
  securityCheck,
  handler
})
