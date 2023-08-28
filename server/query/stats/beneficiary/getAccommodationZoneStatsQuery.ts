import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { canOnlyListItsBeneficiaries } from '~/server/security/rules'
import { ProtectedAppContextUser } from '~/server/trpc'
import { prepareBeneficiaryStatFilters } from '~/utils/filters'

export async function getAccommodationZoneStatsQuery(
  user: ProtectedAppContextUser,
  input: StatFilterInput
) {
  const referents = canOnlyListItsBeneficiaries(user)
    ? { some: { id: user.id } }
    : undefined

  return await prismaClient.beneficiary.groupBy({
    by: ['accommodationZone'],
    where: {
      structureId: user.structureId,
      ...prepareBeneficiaryStatFilters(input),
      referents
    },
    _count: true,
    orderBy: { _count: { accommodationZone: 'desc' } }
  })
}
