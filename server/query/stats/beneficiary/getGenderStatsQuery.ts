import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareBeneficiaryStatFilters } from '~/utils/filters'

export async function getGenderStatsQuery(
  structureId: string,
  input: StatFilterInput
) {
  return await prismaClient.beneficiary.groupBy({
    by: ['gender'],
    where: {
      structureId,
      ...prepareBeneficiaryStatFilters(input)
    },
    _count: true,
    orderBy: { _count: { gender: 'desc' } }
  })
}
