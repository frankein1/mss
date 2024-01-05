import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { EditCommentInput, editCommentSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { COMMENT_RELATIONS_INCLUDE } from '~/utils/constants/comment'
import { canEditComment } from '~/server/security/rules/comment'
import { CommentRepo } from '~/server/database'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: EditCommentInput
) => {
  const { commentId: id } = input
  const comment = await CommentRepo.findUniqueOrThrow(ctx.user, {
    where: { id }
  })
  return canEditComment(ctx.user, comment)
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
