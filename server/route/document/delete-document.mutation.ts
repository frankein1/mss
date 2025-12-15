import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { DeleteDocumentInput } from '~/server/schema'
import { deleteDocumentSchema } from '~/server/schema'
import type { ProtectedAppContext } from '~/server/trpc'
import type { SecurityRuleContext } from '~/server/security'
import { DocumentService } from '~/server/services'

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
}) =>
  DocumentService.deleteDocument({
    user: ctx.user,
    key: input.documentKey
  })

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
