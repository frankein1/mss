import { AppContext, forbiddenError, invalidError } from '~/server/trpc'
import { canDeleteBeneficiaryFollowup } from '~/server/query/security/rules'
import { prismaClient } from '~/server/prisma'

function getFollowup(id: string) {
  return prismaClient.followup.findUnique({
    where: { id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      }
    }
  })
}

export const deleteFollowupHandler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: AppContext
}) => {
  const followup = await getFollowup(id)

  if (!followup) {
    throw invalidError('Followup not found')
  }

  if (!canDeleteBeneficiaryFollowup(user, followup.beneficiary, followup)) {
    throw forbiddenError()
  }

  await prismaClient.followup.delete({ where: { id } })
}
