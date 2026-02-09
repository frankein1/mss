import { UserActivityType } from '~/prisma/generated/client'
import { createMutation } from '~/server/route'
import type { AddCommentInput } from '~/server/schema'
import { addCommentSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import type { ProtectedAppContext } from '~/server/trpc'
import { CommentService, BeneficiaryService } from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: AddCommentInput
) => {
  const permissions = await BeneficiaryService.getEditionPermissions(
    ctx,
    input.beneficiaryId
  )
  return permissions.create.comment
}

const handler = ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: AddCommentInput
}) => {
  return CommentService.create({ ctx, input })
}

export const addCommentMutation = createMutation({
  inputValidation: addCommentSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'comment.add',
    target: 'Comment',
    targetId: ({ routeResult }) => {
      return routeResult.comment.id
    },
    action: UserActivityType.CREATE
  }
})
