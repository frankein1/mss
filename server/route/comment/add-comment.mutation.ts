import { NotificationType, UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { AddCommentInput, addCommentSchema } from '~/server/schema'
import { canAddComment, SecurityRuleContext } from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import { COMMENT_RELATIONS_INCLUDE } from '~/utils/constants/comment'
import { CommentRepo, FollowupRepo, HelpRequestRepo } from '~/server/database'
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
  let history
  if (input.isFollowup) {
    history = await FollowupRepo.findUniqueOrThrow(user, {
      where: { id: input.historyId },
      select: { createdById: true }
    })
  } else {
    history = await HelpRequestRepo.findUniqueOrThrow(user, {
      where: { id: input.historyId },
      select: { createdById: true }
    })
  }

  const { createdById } = history

  return CommentRepo.prisma.create({
    data: {
      content: input.content,
      createdById: user.id,
      followupId: input.isFollowup ? input.historyId : undefined,
      helpRequestId: !input.isFollowup ? input.historyId : undefined,
      notification: {
        create: {
          recipientId: createdById,
          beneficiaryId: input.beneficiaryId,
          followupId: input.isFollowup ? input.historyId : undefined,
          helpRequestId: !input.isFollowup ? input.historyId : undefined,
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
