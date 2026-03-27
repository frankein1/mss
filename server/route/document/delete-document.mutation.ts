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

/** Manage document deletion for
 * - document stored in the db
 * - document stored in object storage or db according to migration status
 *
 * When the migration to S3 is completed, the check on migration can be safely removed
 */
const handler = async ({
  ctx,
  input: { documentKey }
}: {
  ctx: ProtectedAppContext
  input: DeleteDocumentInput
}) => {
  const document = await getDocumentMetadata(ctx, documentKey)

  await deleteFromDb(ctx, documentKey)

  const config = useRuntimeConfig()
  if (config.document.useS3Storage) {
    // If S3 deletion fails, an orphan document is kept in the bucket and this event is logged for manual cleanup
    deleteFile(config, document.filenameDisk).catch(err =>
      console.error(
        `delete-document: failure to delete from S3 for path ${document.filenameDisk}`
      )
    )
  }
}

async function getDocumentMetadata(ctx: SecurityRuleContext, key: string) {
  return await DocumentRepo.findUniqueOrThrow(ctx.user, {
    where: { key },
    select: { filenameDisk: true, migrated: true }
  })
}

async function deleteFromDb(ctx: SecurityRuleContext, key: string) {
  return await DocumentRepo.delete(ctx.user, {
    select: { key: true },
    where: { key }
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
