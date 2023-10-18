import { BeneficiaryRepo, BeneficiaryConstraints } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareBeneficiaryStatFilters } from '~/utils/filters'

export async function getGenderStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  // HACK: right solution is to abstract groupBy in repo
  const constraints = BeneficiaryConstraints.get(user)

  return await BeneficiaryRepo.groupBy({
    by: ['gender'],
    where: {
      ...prepareBeneficiaryStatFilters(input),
      ...constraints
    },
    _count: true,
    orderBy: { _count: { gender: 'desc' } }
  })
}
