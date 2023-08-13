import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareHelpRequestStatFilters } from '~/utils/filters'

export async function getHelpRequestMinistreStatsQuery(
  structureId: string,
  input: StatFilterInput
) {
  return await prismaClient.helpRequest.groupBy({
    by: ['ministre'],
    where: {
      structureId,
      ...prepareHelpRequestStatFilters(input)
    },
    _count: true,
    orderBy: { _count: { ministre: 'desc' } }
  })
}
