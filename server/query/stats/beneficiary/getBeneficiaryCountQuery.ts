import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareBeneficiaryStatFilters } from '~/utils/filters'

export async function getBeneficiaryCountQuery(
  structureId: string,
  input: StatFilterInput
) {
  return await prismaClient.beneficiary.count({
    where: {
      structureId,
      ...prepareBeneficiaryStatFilters(input)
    }
  })
}
