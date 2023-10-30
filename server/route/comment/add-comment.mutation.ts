import { NotificationType, Prisma, UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { AddCommentInput, addCommentSchema } from '~/server/schema'
import { getBeneficiarySecurityTarget } from '~/server/query'
import { canAddComment, SecurityRuleGrantee } from '~/server/security'
import { ProtectedAppContext, invalidError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'

const handler = async ({
  ctx: { user },
  input
}: {
  ctx: ProtectedAppContext
  input: AddCommentInput
}) => {
  let comment
  if (input.isFollowup) {
    comment = await addCommentToFollowup(input, user)
  } else {
    comment = await addCommentToHelpRequest(input, user)
  }

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.CREATE,
    object: 'Comment',
    objectId: comment.id
  })

  return comment
}

function addCommentToFollowup(
  input: AddCommentInput,
  user: SecurityRuleGrantee
) {
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
  user: SecurityRuleGrantee
) {
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
  const helpRequest = await transaction.helpRequest.findUniqueOrThrow({
    where: { id: input.historyId },
    select: { createdById: true }
  })

  if (helpRequest.createdById && helpRequest.createdById !== userId) {
    await addNewCommentNotification(
      transaction,
      helpRequest.createdById,
      input.beneficiaryId,
      { helpRequestId: input.historyId }
    )
  }
}

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

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: AddCommentInput
) => {
  const beneficiary = await getBeneficiarySecurityTarget(
    user,
    input.beneficiaryId
  )
  return canAddComment(user, beneficiary)
}

export const addCommentMutation = createMutation({
  inputValidation: addCommentSchema,
  securityCheck,
  handler
})
