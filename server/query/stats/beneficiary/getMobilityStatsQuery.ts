import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { canOnlyListItsBeneficiaries } from '~/server/security/rules'
import { ProtectedAppContextUser } from '~/server/trpc'
import { prepareBeneficiaryStatFilters } from '~/utils/filters'

export async function getMobilityStatsQuery(
  user: ProtectedAppContextUser,
  input: StatFilterInput
) {
  const referents = canOnlyListItsBeneficiaries(user)
    ? { some: { id: user.id } }
    : undefined

  return await prismaClient.beneficiary.groupBy({
    by: ['mobility'],
    where: {
      structureId: user.structureId,
      ...prepareBeneficiaryStatFilters(input),
      referents
    },
    _count: true,
    orderBy: { _count: { mobility: 'desc' } }
  })
}
