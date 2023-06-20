import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareBeneficiaryStatFilters } from '~/utils/filters'

export const getGenderStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await prismaClient.beneficiary.groupBy({
    by: ['gender'],
    where: {
      structureId: user.structureId,
      ...prepareBeneficiaryStatFilters(input)
    },
    _count: true,
    orderBy: { _count: { gender: 'desc' } }
  })
}
