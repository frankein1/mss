import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { AddCommentInput, addCommentSchema } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import { FamilyFileService, CommentService } from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: AddCommentInput
) => {
  const permissions = await FamilyFileService.getEditionPermissions(
    ctx,
    input.familyFileId
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
