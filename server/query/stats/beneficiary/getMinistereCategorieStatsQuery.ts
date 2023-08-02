import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareBeneficiaryStatFilters } from '~/utils/filters'

export async function getMinistereCategorieStatsQuery(
  structureId: string,
  input: StatFilterInput
) {
  return await prismaClient.beneficiary.groupBy({
    by: ['ministereCategorie'],
    where: {
      structureId,
      ...prepareBeneficiaryStatFilters(input)
    },
    _count: true,
    orderBy: { _count: { ministereCategorie: 'desc' } }
  })
}
