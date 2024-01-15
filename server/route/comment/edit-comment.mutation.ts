import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { EditCommentInput, editCommentSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { COMMENT_RELATIONS_INCLUDE } from '~/utils/constants/comment'
import { CommentRepo } from '~/server/database'
import { getCommentPermissions } from '~/server/security'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: EditCommentInput
) => {
  const { commentId: id } = input
  const comment = await CommentRepo.findUniqueOrThrow(ctx.user, {
    where: { id }
  })
  const permissions = getCommentPermissions({ ctx, comment })
  return permissions.edit
}

const handler = async ({
  ctx: _ctx,
  input: { commentId, content }
}: {
  ctx: ProtectedAppContext
  input: EditCommentInput
}) => {
  return await CommentRepo.prisma.update({
    where: { id: commentId },
    data: {
      content,
      updated: new Date()
    },
    include: COMMENT_RELATIONS_INCLUDE
  })
}

export const editCommentMutation = createMutation({
  inputValidation: editCommentSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'comment.edit',
    target: 'Comment',
    targetId: ({ routeResult }) => {
      return routeResult.id
    },
    action: UserActivityType.UPDATE
  }
})
