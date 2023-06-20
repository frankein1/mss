import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import type { QuickEditFollowupInput } from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import { canEditBeneficiaryFollowup } from '~/server/security/rules'

export const quickUpdateFollowupHandler = async ({
  input: { id, ...rest },
  ctx: { user }
}: {
  input: QuickEditFollowupInput
  ctx: ProtectedAppContext
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
