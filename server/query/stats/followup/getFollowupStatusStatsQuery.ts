import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareFollowupStatFilters } from '~/utils/filters'

export async function getFollowupStatusStatsQuery(
  structureId: string,
  input: StatFilterInput
) {
  return await prismaClient.followup.groupBy({
    by: ['status'],
    where: {
      structureId,
      ...prepareFollowupStatFilters(input)
    },
    _count: true,
    orderBy: { _count: { status: 'desc' } }
  })
}
