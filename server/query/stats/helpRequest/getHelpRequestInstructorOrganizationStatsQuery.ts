import { STATS_NULL_LABEL } from '~/client/options/stat'
import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { STATS_NULL_KEY } from '~/utils/constants/stats'
import { prepareHelpRequestStatFilters } from '~/utils/filters'

export async function getHelpRequestInstructorOrganizationStatsQuery(
  structureId: string,
  input: StatFilterInput
) {
  const helpRequests = await prismaClient.helpRequest.findMany({
    where: {
      structureId,
      ...prepareHelpRequestStatFilters(input)
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
