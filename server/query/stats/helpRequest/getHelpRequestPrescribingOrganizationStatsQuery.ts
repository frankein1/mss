import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareHelpRequestStatFilters } from '~/utils/filters'
import { preparePrescribingOrganizationStats } from '~/utils/stats'

export async function getHelpRequestPrescribingOrganizationStatsQuery(
  structureId: string,
  input: StatFilterInput
) {
  const helpRequests = await prismaClient.helpRequest.findMany({
    where: {
      structureId,
      ...prepareHelpRequestStatFilters(input)
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
