import { Prisma } from '@prisma/client'
import { FollowupTypeRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { canOnlyListItsBeneficiaries } from '~/server/security/rules'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareHelpRequestStatFilters } from '~/utils/filters'

export async function getHelpRequestFollowupTypesStatsQuery(
  user: SecurityRuleGrantee,
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

  return await FollowupTypeRepo.findMany(user, {
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          helpRequests: {
            where: {
              structureId: user.structureId || '',
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
