import { BeneficiaryRepo } from '~/server/repository'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareBeneficiaryStatFilters } from '~/utils/filters'

export async function getMinistereCategorieStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const constraints = BeneficiaryRepo.viewConstraints(user)

  return await BeneficiaryRepo.groupBy({
    by: ['ministereCategorie'],
    where: {
      ...prepareBeneficiaryStatFilters(input),
      ...constraints
    },
    _count: true,
    orderBy: { _count: { ministereCategorie: 'desc' } }
  })
}
