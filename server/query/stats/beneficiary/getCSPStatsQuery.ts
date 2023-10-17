import {
  BeneficiaryRepo,
  getConstraintOnBeneficiary
} from '~/server/repository'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareBeneficiaryStatFilters } from '~/utils/filters'

export async function getCSPStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  // HACK: right solution is to abstract groupBy in repo
  const constraints = getConstraintOnBeneficiary(user)

  return await BeneficiaryRepo.groupBy({
    by: ['socioProfessionalCategory'],
    where: {
      ...prepareBeneficiaryStatFilters(input),
      ...constraints
    },
    _count: true,
    orderBy: { _count: { socioProfessionalCategory: 'desc' } }
  })
}
