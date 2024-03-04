import { prepareHelpRequestStatFilters } from '../helpers'
import { SocialSupportRepo } from '~/server/database'
import { STATS_NULL_LABEL } from '~/client/options'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { STATS_NULL_KEY } from '~/utils/constants/stats'

export async function getHelpRequestInstructorOrganizationStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const preparedFilters = prepareHelpRequestStatFilters(input, true)

  const socialSupports = await SocialSupportRepo.findMany(user, {
    where: preparedFilters,
    select: {
      fileInstruction: {
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

  const helpRequests = socialSupports.reduce(
    (fu, { fileInstruction }) => {
      if (fileInstruction) {
        fu.push(fileInstruction)
      }
      return fu
    },
    [] as Array<Exclude<(typeof socialSupports)[0]['fileInstruction'], null>>
  )

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
