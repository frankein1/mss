import { NotificationType, Prisma, UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { AddCommentInput, addCommentSchema } from '~/server/schema'
import { getBeneficiarySecurityTarget } from '~/server/query'
import {
  SecurityTargetWithReferents,
  SecurityTargetWithStructure,
  canAddCommentToFollowup,
  canAddCommentToHelpRequest
} from '~/server/security/rules'
import {
  ProtectedAppContext,
  forbiddenError,
  invalidError
} from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import {
  AllowSecurityCheck,
  SecurityRuleGrantee
} from '~/server/security/rules/types'
import { COMMENT_RELATIONS_INCLUDE } from '~/utils/constants/comment'

const handler = async ({
  ctx: { user },
  input
}: {
  ctx: ProtectedAppContext
  input: AddCommentInput
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(
    user,
    input.beneficiaryId
  )

  if (!beneficiary) {
    throw invalidError('Beneficiary not found')
  }

  let comment
  if (input.isFollowup) {
    comment = await addCommentToFollowup(input, user, beneficiary)
  } else {
    comment = await addCommentToHelpRequest(input, user, beneficiary)
  }

  return comment
}

function addCommentToFollowup(
  input: AddCommentInput,
  user: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
) {
  if (!canAddCommentToFollowup(user, beneficiary)) {
    throw forbiddenError()
  }

  return prismaClient.$transaction(async transaction => {
    await addNewCommentNotificationForFollowup(transaction, input, user.id)

    return transaction.comment.create({
      data: {
        content: input.content,
        createdById: user.id,
        followupId: input.historyId
      },
      include: COMMENT_RELATIONS_INCLUDE
    })
  })
}

function addCommentToHelpRequest(
  input: AddCommentInput,
  user: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
) {
  if (!canAddCommentToHelpRequest(user, beneficiary)) {
    throw forbiddenError()
  }

  return prismaClient.$transaction(async transaction => {
    await addNewCommentNotificationForHelpRequest(transaction, input, user.id)

    return transaction.comment.create({
      data: {
        content: input.content,
        createdById: user.id,
        helpRequestId: input.historyId
      },
      include: COMMENT_RELATIONS_INCLUDE
    })
  })
}

async function addNewCommentNotificationForFollowup(
  transaction: Prisma.TransactionClient,
  input: AddCommentInput,
  userId: string
) {
  const followup = await transaction.followup.findUnique({
    where: { id: input.historyId },
    select: { createdById: true }
  })

  if (!followup) {
    throw invalidError('Followup not found')
  }

  if (followup.createdById && followup.createdById !== userId) {
    await addNewCommentNotification(
      transaction,
      followup.createdById,
      input.beneficiaryId,
      { followupId: input.historyId }
    )
  }
}

async function addNewCommentNotificationForHelpRequest(
  transaction: Prisma.TransactionClient,
  input: AddCommentInput,
  userId: string
) {
  const helpRequest = await transaction.helpRequest.findUnique({
    where: { id: input.historyId },
    select: { createdById: true }
  })

  if (!helpRequest) {
    throw invalidError('HelpRequest not found')
  }

  if (helpRequest.createdById && helpRequest.createdById !== userId) {
    await addNewCommentNotification(
      transaction,
      helpRequest.createdById,
      input.beneficiaryId,
      { helpRequestId: input.historyId }
    )
  }
}

async function addNewCommentNotification(
  transaction: Prisma.TransactionClient,
  recipientId: string,
  beneficiaryId: string,
  historyId: { followupId: string } | { helpRequestId: string }
) {
  await transaction.notification.create({
    data: {
      recipientId,
      beneficiaryId,
      ...historyId,
      type: NotificationType.NewComment
    }
  })
}

export const addCommentMutation = createMutation({
  inputValidation: addCommentSchema,
  securityCheck: AllowSecurityCheck,
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
