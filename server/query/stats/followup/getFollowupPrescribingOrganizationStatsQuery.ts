import { Prisma } from '@prisma/client'
import { FollowupRepo } from '~/server/query'
import { StatFilterInput } from '~/server/schema'
import { canOnlyListItsBeneficiaries } from '~/server/security/rules'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareFollowupStatFilters } from '~/utils/filters'
import { preparePrescribingOrganizationStats } from '~/utils/stats'

export async function getFollowupPrescribingOrganizationStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const referents = canOnlyListItsBeneficiaries(user)
    ? { some: { id: user.id } }
    : undefined

  const { beneficiary: preparedBeneficiaryFilters, ...preparedFilters } =
    prepareFollowupStatFilters(input)

  const beneficiaryFilters: Prisma.BeneficiaryWhereInput =
    preparedBeneficiaryFilters
      ? {
          ...preparedBeneficiaryFilters,
          referents
        }
      : {
          referents
        }

  const followups = await FollowupRepo.findMany(user, {
    where: {
      structureId: user.structureId || '',
      ...preparedFilters,
      beneficiary: beneficiaryFilters
    },
    select: {
      prescribingOrganization: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
  return preparePrescribingOrganizationStats(followups)
}
