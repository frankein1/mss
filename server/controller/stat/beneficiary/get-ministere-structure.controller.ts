import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareBeneficiaryStatFilters } from '~/utils/filters'

export const getMinistereStructureStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await prismaClient.beneficiary.groupBy({
    by: ['ministereStructure'],
    where: {
      structureId: user.structureId,
      ...prepareBeneficiaryStatFilters(input)
    },
    _count: true,
    orderBy: { _count: { ministereStructure: 'desc' } }
  })
}
