import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { EditDocumentInput, editDocumentSchema } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import { DocumentRepo } from '~/server/database'
import { DocumentService } from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: EditDocumentInput
) => {
  const { permissions, document } = await DocumentService.getUpdatePermissions(
    ctx,
    input.key
  )
  if (!permissions.edit) {
    return false
  }
  if (
    input.confidential !== document.confidential &&
    !permissions.set.confidential
  ) {
    return false
  }
  return true
}

const handler = async ({
  ctx: _ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: EditDocumentInput
}) => {
  const { key, beneficiaryId: _beneficiaryId, ...data } = input

  const updatedDocument = await DocumentRepo.prisma.update({
    where: { key },
    data,
    include: { beneficiary: { select: { id: true, structureId: true } } }
  })

  return { document: updatedDocument }
}

export const editDocumentMutation = createMutation({
  inputValidation: editDocumentSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'document.update',
    target: 'Document',
    targetId: ({ input }) => {
      return input.key
    },
    action: UserActivityType.UPDATE
  }
})
