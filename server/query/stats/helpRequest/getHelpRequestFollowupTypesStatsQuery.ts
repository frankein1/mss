import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareHelpRequestStatFilters } from '~/utils/filters'

export async function getHelpRequestFollowupTypesStatsQuery(
  structureId: string,
  input: StatFilterInput
) {
  return await prismaClient.followupType.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          helpRequests: {
            where: {
              structureId,
              ...prepareHelpRequestStatFilters(input)
            }
          }
        }
      }
    },
    orderBy: [{ helpRequests: { _count: 'desc' } }]
  })
}
