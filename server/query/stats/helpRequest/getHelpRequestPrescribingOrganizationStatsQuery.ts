import { Prisma } from '@prisma/client'
import { HelpRequestRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { canOnlyListItsBeneficiaries } from '~/server/security/rules'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareHelpRequestStatFilters } from '~/utils/filters'
import { preparePrescribingOrganizationStats } from '~/utils/stats'

export async function getHelpRequestPrescribingOrganizationStatsQuery(
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

  const helpRequests = await HelpRequestRepo.findMany(user, {
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
  return preparePrescribingOrganizationStats(helpRequests)
}
