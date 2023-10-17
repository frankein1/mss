import { BeneficiaryRepo } from '~/server/repository'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareBeneficiaryStatFilters } from '~/utils/filters'

export async function getMinistereDepartementServiceAcStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const constraints = BeneficiaryRepo.viewConstraints(user)

  return await BeneficiaryRepo.groupBy({
    by: ['ministereDepartementServiceAc'],
    where: {
      ...prepareBeneficiaryStatFilters(input),
      ...constraints
    },
    _count: true,
    orderBy: { _count: { ministereDepartementServiceAc: 'desc' } }
  })
}
