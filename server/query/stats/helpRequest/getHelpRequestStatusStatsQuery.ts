import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareHelpRequestStatFilters } from '~/utils/filters'

export async function getHelpRequestStatusStatsQuery(
  structureId: string,
  input: StatFilterInput
) {
  return await prismaClient.helpRequest.groupBy({
    by: ['status'],
    where: {
      structureId,
      ...prepareHelpRequestStatFilters(input)
    },
    _count: true,
    orderBy: { _count: { status: 'desc' } }
  })
}
