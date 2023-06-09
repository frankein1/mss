import { AppContext, invalidError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareBeneficiaryStatFilters } from '~/utils/filters'

export const getAccommodationModeStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.beneficiary.groupBy({
    by: ['accommodationMode'],
    where: {
      structureId: user.structureId,
      ...prepareBeneficiaryStatFilters(input)
    },
    _count: true,
    orderBy: { _count: { accommodationMode: 'desc' } }
  })
}
