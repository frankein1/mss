import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { DeleteDocumentInput } from '~/server/schema'
import { deleteDocumentSchema } from '~/server/schema'
import type { ProtectedAppContext } from '~/server/trpc'
import type { SecurityRuleContext } from '~/server/security'
import { DocumentService } from '~/server/services'
import { DocumentRepo } from '~/server/database'
import { deleteFile } from '~/server/lib/s3/file'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: DeleteDocumentInput
) => {
  const { permissions } = await DocumentService.getEditionPermissions(
    ctx,
    input.documentKey
  )
  return permissions.delete
}

const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: DeleteDocumentInput
}) => {
  const document = await DocumentRepo.findUniqueOrThrow(ctx.user, {
    where: { key: input.documentKey },
    select: { filenameDisk: true, migrated: true }
  })

  // If document has been migrated, delete file from S3 and from DB
  if (document.migrated) {
    const config = useRuntimeConfig()

    await deleteFile(config, document.filenameDisk)
    return await DocumentRepo.prisma.delete({
      select: { key: true },
      where: { key: input.documentKey }
    })
  }

  // Else, delete from DB with cascade to delete content
  return await DocumentRepo.prisma.delete({
    select: { key: true },
    where: { key: input.documentKey }
  })
}

export const deleteDocumentMutation = createMutation({
  inputValidation: deleteDocumentSchema,
  handler,
  securityCheck,
  auditLog: {
    key: 'document.delete',
    target: 'Document',
    targetId: ({ input }) => {
      return input.documentKey
    },
    action: UserActivityType.DELETE
  }
})
