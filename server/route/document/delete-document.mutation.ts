import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { DeleteDocumentInput, deleteDocumentSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { SecurityRuleContext } from '~/server/security'
import { deleteUploadedFile } from '~/server/lib/s3'
import { DocumentRepo } from '~/server/database'
import { DocumentService } from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: DeleteDocumentInput
) => {
  const { permissions } = await DocumentService.getUpdatePermissions(
    ctx,
    input.documentKey
  )
  return permissions.delete
}

const handler = async ({
  ctx: { user },
  input
}: {
  ctx: ProtectedAppContext
  input: DeleteDocumentInput
}) => {
  const { documentKey } = input

  const document = await DocumentRepo.findUniqueOrThrow(user, {
    where: { key: documentKey }
  })

  await deleteUploadedFile({ key: document.filenameDisk }).catch(error => {
    throw error
  })

  await DocumentRepo.prisma.delete({
    where: { key: documentKey }
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
