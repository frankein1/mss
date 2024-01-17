import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { IdInput, idSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { CommentRepo } from '~/server/database'
import { getCommentPermissions } from '~/server/security'

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) => {
  const { id } = input
  const comment = await CommentRepo.findUniqueOrThrow(ctx.user, {
    where: { id }
  })

  const permissions = getCommentPermissions({ ctx, comment })
  return permissions.delete
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
    include: { createdBy: true }
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
