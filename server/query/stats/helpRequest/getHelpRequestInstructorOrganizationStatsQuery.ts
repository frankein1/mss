import { Prisma, SocialSupportType } from '@prisma/client'
import { prepareSocialSupportStatFilters } from '../helpers'
import { BeneficiaryHistoryRepo } from '~/server/database'
import { STATS_NULL_LABEL } from '~/client/options/stat'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { STATS_NULL_KEY } from '~/utils/constants/stats'

export async function getHelpRequestInstructorOrganizationStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const { beneficiary: preparedBeneficiaryFilters, ...preparedFilters } =
    prepareSocialSupportStatFilters(input)

  const beneficiaryFilters: Prisma.BeneficiaryWhereInput =
    preparedBeneficiaryFilters
      ? {
          ...preparedBeneficiaryFilters
        }
      : {}

  const helpRequests = await BeneficiaryHistoryRepo.findMany(user, {
    where: {
      ...preparedFilters,
      beneficiary: beneficiaryFilters,
      socialSupportType: SocialSupportType.HelpRequestOther
    },
    select: {
      helpRequest: {
        select: {
          instructorOrganization: {
            select: {
              id: true,
              name: true
            }
          }
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
      const { helpRequest } = historyItem
      const instructorOrganizationId =
        helpRequest?.instructorOrganization?.id || STATS_NULL_KEY
      if (instructorOrganizationId in instructorOrganizations) {
        instructorOrganizations[instructorOrganizationId]._count++
      } else {
        instructorOrganizations[instructorOrganizationId] = {
          instructorOrganizationId,
          instructorOrganization:
            helpRequest?.instructorOrganization?.name || STATS_NULL_LABEL,
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
