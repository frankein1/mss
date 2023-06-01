import { AppContext, forbiddenError } from '~/server/trpc'
import type { EditFollowupStatusInput } from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import { canEditBeneficiaryFollowup } from '~/server/query/security/rules'

export const updateFollowupStatusHandler = async ({
  input: { id, ...rest },
  ctx: { user }
}: {
  input: EditFollowupStatusInput
  ctx: AppContext
}) => {
  const target = await prismaClient.followup.findUnique({
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
    !canEditBeneficiaryFollowup(user, target.beneficiary, target)
  ) {
    throw forbiddenError()
  }

  return await prismaClient.followup.update({ where: { id }, data: rest })
}
