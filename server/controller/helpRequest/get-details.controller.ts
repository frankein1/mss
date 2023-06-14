import { AppContext, invalidError, forbiddenError } from '~/server/trpc'
import {
  canViewBeneficiaryHelpRequest,
  canViewBeneficiaryHelpRequestSynthesis,
  canViewBeneficiaryHelpRequestPrivateSynthesis
} from '~/server/security/rules'
import { prismaClient } from '~/server/prisma'

export const getHelpRequestDetailsHandler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }

  const helpRequest = await prismaClient.helpRequest.findUnique({
    where: { id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      },
      documents: true
    }
  })

  if (
    !helpRequest ||
    !canViewBeneficiaryHelpRequest(user, helpRequest.beneficiary, helpRequest)
  ) {
    throw forbiddenError()
  }

  helpRequest.synthesis = canViewBeneficiaryHelpRequestSynthesis(
    user,
    helpRequest.beneficiary,
    helpRequest
  )
    ? helpRequest.synthesis
    : null

  helpRequest.privateSynthesis = canViewBeneficiaryHelpRequestPrivateSynthesis(
    user,
    helpRequest.beneficiary,
    helpRequest
  )
    ? helpRequest.privateSynthesis
    : null

  return helpRequest
}
