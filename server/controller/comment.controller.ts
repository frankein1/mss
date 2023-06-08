import { User } from '@prisma/client'
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

function addCommentToFollowup(
  content: string,
  followupId: string,
  user: User,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
) {
  if (!canAddCommentToBeneficiaryFollowup(user, beneficiary)) {
    throw forbiddenError()
  }

  return prismaClient.comment.create({
    data: {
      content,
      createdById: user.id,
      followupId
    },
    include: addCommentInclude
  })
}

function addCommentToHelpRequest(
  content: string,
  helpRequestId: string,
  user: User,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
) {
  if (!canAddCommentToBeneficiaryHelpRequest(user, beneficiary)) {
    throw forbiddenError()
  }

  return prismaClient.comment.create({
    data: {
      content,
      createdById: user.id,
      helpRequestId
    },
    include: addCommentInclude
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
    return addCommentToFollowup(
      input.content,
      input.historyId,
      user,
      beneficiary
    )
  }

  return addCommentToHelpRequest(
    input.content,
    input.historyId,
    user,
    beneficiary
  )
}
