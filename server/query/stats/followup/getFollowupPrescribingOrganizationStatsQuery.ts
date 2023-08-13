import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareFollowupStatFilters } from '~/utils/filters'
import { preparePrescribingOrganizationStats } from '~/utils/stats'

export async function getFollowupPrescribingOrganizationStatsQuery(
  structureId: string,
  input: StatFilterInput
) {
  const followups = await prismaClient.followup.findMany({
    where: {
      structureId,
      ...prepareFollowupStatFilters(input)
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
