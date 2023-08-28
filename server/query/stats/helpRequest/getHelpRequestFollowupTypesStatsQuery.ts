import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { canOnlyListItsBeneficiaries } from '~/server/security/rules'
import { ProtectedAppContextUser } from '~/server/trpc'
import { prepareHelpRequestStatFilters } from '~/utils/filters'

export async function getHelpRequestFollowupTypesStatsQuery(
  user: ProtectedAppContextUser,
  input: StatFilterInput
) {
  const referents = canOnlyListItsBeneficiaries(user)
    ? { some: { id: user.id } }
    : undefined

  const { beneficiary: preparedBeneficiaryFilters, ...preparedFilters } =
    prepareHelpRequestStatFilters(input)

  const beneficiaryFilters: Prisma.BeneficiaryWhereInput =
    preparedBeneficiaryFilters
      ? {
          ...preparedBeneficiaryFilters,
          referents
        }
      : {
          referents
        }

  return await prismaClient.followupType.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          helpRequests: {
            where: {
              structureId: user.structureId,
              ...preparedFilters,
              beneficiary: beneficiaryFilters
            }
          }
        }
      }
    },
    orderBy: [{ helpRequests: { _count: 'desc' } }]
  })
}
