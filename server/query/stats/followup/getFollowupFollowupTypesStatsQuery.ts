import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareFollowupStatFilters } from '~/utils/filters'

export async function getFollowupFollowupTypesStatsQuery(
  structureId: string,
  input: StatFilterInput
) {
  return await prismaClient.followupType.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          followups: {
            where: {
              structureId,
              ...prepareFollowupStatFilters(input)
            }
          }
        }
      }
    },
    orderBy: [{ followups: { _count: 'desc' } }]
  })
}
