import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { canOnlyListItsBeneficiaries } from '~/server/security/rules'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareBeneficiaryStatFilters } from '~/utils/filters'

export async function getMinistereStructureStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const referents = canOnlyListItsBeneficiaries(user)
    ? { some: { id: user.id } }
    : undefined

  return await prismaClient.beneficiary.groupBy({
    by: ['ministereStructure'],
    where: {
      structureId: user.structureId || '',
      ...prepareBeneficiaryStatFilters(input),
      referents
    },
    _count: true,
    orderBy: { _count: { ministereStructure: 'desc' } }
  })
}
