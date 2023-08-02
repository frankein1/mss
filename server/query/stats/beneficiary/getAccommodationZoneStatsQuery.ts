import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareBeneficiaryStatFilters } from '~/utils/filters'

export async function getAccommodationZoneStatsQuery(
  structureId: string,
  input: StatFilterInput
) {
  return await prismaClient.beneficiary.groupBy({
    by: ['accommodationZone'],
    where: {
      structureId,
      ...prepareBeneficiaryStatFilters(input)
    },
    _count: true,
    orderBy: { _count: { accommodationZone: 'desc' } }
  })
}
