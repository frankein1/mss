import { NotificationType, UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { AddCommentInput, addCommentSchema } from '~/server/schema'
import { SecurityRuleContext, getCommentPermissions } from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import { CommentRepo, SocialSupportRepo } from '~/server/database'
import { BeneficiaryService } from '~/server/services'

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

const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: AddCommentInput
}) => {
  const { user } = ctx
  const socialSupport = await SocialSupportRepo.findUniqueOrThrow(user, {
    where: { id: input.socialSupportId },
    select: { id: true, createdById: true }
  })

  const comment = await CommentRepo.prisma.create({
    data: {
      content: input.content,
      createdById: user.id,
      socialSupportId: socialSupport.id,
      notification: {
        create: {
          recipientId: socialSupport.createdById,
          beneficiaryId: input.beneficiaryId,
          socialSupportId: socialSupport.id,
          type: NotificationType.NewComment,
          itemCreatedById: user.id
        }
      }
    },
    include: {
      createdBy: true
    }
  })

  const permissions = getCommentPermissions({
    ctx,
    comment
  })

  return { comment, permissions }
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
