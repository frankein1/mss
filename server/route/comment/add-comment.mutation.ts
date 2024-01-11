import { NotificationType, UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { AddCommentInput, addCommentSchema } from '~/server/schema'
import { canAddComment, SecurityRuleContext } from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import { COMMENT_RELATIONS_INCLUDE } from '~/utils/constants/comment'
import { CommentRepo, SocialSupportRepo } from '~/server/database'
import { BeneficiaryService } from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: AddCommentInput
) => {
  const beneficiary = await BeneficiaryService.getBeneficiarySecurityTarget(
    ctx.user,
    input.beneficiaryId
  )
  return canAddComment(ctx.user, beneficiary)
}

const handler = async ({
  ctx: { user },
  input
}: {
  ctx: ProtectedAppContext
  input: AddCommentInput
}) => {
  const socialSupport = await SocialSupportRepo.findUniqueOrThrow(user, {
    where: { id: input.socialSupportId },
    select: { id: true, createdById: true }
  })

  return CommentRepo.prisma.create({
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
    include: COMMENT_RELATIONS_INCLUDE
  })
}

export const addCommentMutation = createMutation({
  inputValidation: addCommentSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'comment.add',
    target: 'Comment',
    targetId: ({ routeResult }) => {
      return routeResult.id
    },
    action: UserActivityType.CREATE
  }
})
