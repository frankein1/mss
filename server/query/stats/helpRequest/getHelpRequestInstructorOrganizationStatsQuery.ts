import { Prisma } from '@prisma/client'
import { HelpRequestRepo } from '~/server/database'
import { STATS_NULL_LABEL } from '~/client/options/stat'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { STATS_NULL_KEY } from '~/utils/constants/stats'
import { prepareHelpRequestStatFilters } from '~/utils/filters'

export async function getHelpRequestInstructorOrganizationStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const { beneficiary: preparedBeneficiaryFilters, ...preparedFilters } =
    prepareHelpRequestStatFilters(input)

  const beneficiaryFilters: Prisma.BeneficiaryWhereInput =
    preparedBeneficiaryFilters
      ? {
          ...preparedBeneficiaryFilters
        }
      : {}

  const helpRequests = await HelpRequestRepo.findMany(user, {
    where: {
      ...preparedFilters,
      beneficiary: beneficiaryFilters
    },
    select: {
      instructorOrganization: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
  const instructorOrganizationStats = helpRequests.reduce(
    (
      instructorOrganizations: {
        [k: string]: {
          instructorOrganizationId: string
          instructorOrganization: string
          _count: number
        }
      },
      historyItem
    ) => {
      const instructorOrganizationId =
        historyItem.instructorOrganization?.id || STATS_NULL_KEY
      if (instructorOrganizationId in instructorOrganizations) {
        instructorOrganizations[instructorOrganizationId]._count++
      } else {
        instructorOrganizations[instructorOrganizationId] = {
          instructorOrganizationId,
          instructorOrganization:
            historyItem.instructorOrganization?.name || STATS_NULL_LABEL,
          _count: 1
        }
      }
      return instructorOrganizations
    },
    {}
  )
  const instructorOrganizationStatsValues = Object.values(
    instructorOrganizationStats
  )
  instructorOrganizationStatsValues.sort((a, b) => b._count - a._count)
  return instructorOrganizationStatsValues
}
