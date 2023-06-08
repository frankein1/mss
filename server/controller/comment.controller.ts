import { User, Prisma, NotificationType } from '@prisma/client'
import { AppContext, invalidError, forbiddenError } from '~/server/trpc'
import { AddCommentInput } from '~/server/schema'
import {
  canAddCommentToBeneficiaryFollowup,
  canAddCommentToBeneficiaryHelpRequest,
  SecurityTargetWithStructure,
  SecurityTargetWithReferents
} from '~/server/query/security/rules'
import { getBeneficiarySecurityTarget } from '~/server/query/security'
import { prismaClient } from '~/server/prisma'

const addCommentInclude = {
  createdBy: {
    select: { firstName: true, lastName: true, email: true }
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
      { followupId: input.historyId }
    )
  }
}

function addCommentToFollowup(
  input: AddCommentInput,
  user: User,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
) {
  if (!canAddCommentToBeneficiaryFollowup(user, beneficiary)) {
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
      include: addCommentInclude
    })
  })
}

function addCommentToHelpRequest(
  input: AddCommentInput,
  user: User,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
) {
  if (!canAddCommentToBeneficiaryHelpRequest(user, beneficiary)) {
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
      include: addCommentInclude
    })
  })
}

export const addCommentHandler = async ({
  ctx: { user },
  input
}: {
  ctx: AppContext
  input: AddCommentInput
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(input.beneficiaryId)

  if (!beneficiary) {
    throw invalidError('Beneficiary not found')
  }

  if (input.isFollowup) {
    return addCommentToFollowup(input, user, beneficiary)
  }

  return addCommentToHelpRequest(input, user, beneficiary)
}
