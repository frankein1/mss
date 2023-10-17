import { BeneficiaryRepo } from '~/server/repository'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareBeneficiaryStatFilters } from '~/utils/filters'

export async function getMobilityStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const constraints = BeneficiaryRepo.viewConstraints(user)

  return await BeneficiaryRepo.groupBy({
    by: ['mobility'],
    where: {
      ...prepareBeneficiaryStatFilters(input),
      ...constraints
    },
    _count: true,
    orderBy: { _count: { mobility: 'desc' } }
  })
}
