import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareFollowupStatFilters } from '~/utils/filters'

export async function getFollowupMediumStatsQuery(
  structureId: string,
  input: StatFilterInput
) {
  return await prismaClient.followup.groupBy({
    by: ['medium'],
    where: {
      structureId,
      ...prepareFollowupStatFilters(input)
    },
    _count: true,
    orderBy: { _count: { medium: 'desc' } }
  })
}
