import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { IdInput, idSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { canEditComment } from '~/server/security/rules/comment'
import { CommentRepo } from '~/server/database'
import { COMMENT_RELATIONS_INCLUDE } from '~/utils/constants/comment'

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) => {
  const { id } = input
  const comment = await CommentRepo.findUniqueOrThrow(ctx.user, {
    where: { id }
  })
  return canEditComment(ctx.user, comment)
}

const handler = async ({
  ctx: _ctx,
  input: { id }
}: {
  ctx: ProtectedAppContext
  input: { id: string }
}) => {
  return await CommentRepo.prisma.delete({
    where: { id },
    include: COMMENT_RELATIONS_INCLUDE
  })
}

export const deleteCommentMutation = createMutation({
  inputValidation: idSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'comment.delete',
    target: 'Comment',
    targetId: ({ routeResult }) => {
      return routeResult.id
    },
    action: UserActivityType.DELETE
  }
})
