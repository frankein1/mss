import { prepareBeneficiaryStatFilters } from '../helpers'
import { BeneficiaryRepo, BeneficiaryConstraints } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getMobilityStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  // HACK: right solution is to abstract groupBy in repo
  const constraints = BeneficiaryConstraints.get(user)

  return await BeneficiaryRepo.prisma.groupBy({
    by: ['mobility'],
    where: {
      ...prepareBeneficiaryStatFilters(input),
      ...constraints
    },
    _count: true,
    orderBy: { _count: { mobility: 'desc' } }
  })
}
