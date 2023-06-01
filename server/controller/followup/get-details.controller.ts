import { AppContext, invalidError, forbiddenError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import {
  canViewBeneficiaryFollowup,
  canViewBeneficiaryFollowupSynthesis,
  canViewBeneficiaryFollowupPrivateSynthesis
} from '~/server/query/security/rules'

export const getFollowupDetailsHandler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }

  const followup = await prismaClient.followup.findUnique({
    where: { id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      },
      types: true,
      documents: true
    }
  })

  if (
    !followup ||
    !canViewBeneficiaryFollowup(user, followup.beneficiary, followup)
  ) {
    throw forbiddenError()
  }

  followup.synthesis = canViewBeneficiaryFollowupSynthesis(
    user,
    followup.beneficiary,
    followup
  )
    ? followup.synthesis
    : null

  followup.privateSynthesis = canViewBeneficiaryFollowupPrivateSynthesis(
    user,
    followup.beneficiary,
    followup
  )
    ? followup.privateSynthesis
    : null

  return followup
}
