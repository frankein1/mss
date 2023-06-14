import { helpRequestGetPageSelect } from './get-page.controller'
import { AppContext, forbiddenError } from '~/server/trpc'
import type { QuickEditHelpRequestInput } from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import { canEditBeneficiaryHelpRequest } from '~/server/security/rules'

export const quickUpdateHelpRequestHandler = async ({
  input: { id, ...rest },
  ctx: { user }
}: {
  input: QuickEditHelpRequestInput
  ctx: AppContext
}) => {
  const target = await prismaClient.helpRequest.findUnique({
    where: { id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      }
    }
  })

  if (
    !target ||
    !canEditBeneficiaryHelpRequest(user, target.beneficiary, target)
  ) {
    throw forbiddenError()
  }

  return await prismaClient.helpRequest.update({
    where: { id },
    data: rest,
    select: helpRequestGetPageSelect
  })
}
