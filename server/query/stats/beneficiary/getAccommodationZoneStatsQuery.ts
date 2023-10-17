import {
  BeneficiaryRepo,
  getConstraintsOnBeneficiary
} from '~/server/repository'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareBeneficiaryStatFilters } from '~/utils/filters'

export async function getAccommodationZoneStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  // HACK: right solution is to abstract groupBy in repo
  const constraints = getConstraintsOnBeneficiary(user)

  return await BeneficiaryRepo.groupBy({
    by: ['accommodationZone'],
    where: {
      ...prepareBeneficiaryStatFilters(input),
      ...constraints
    },
    _count: true,
    orderBy: { _count: { accommodationZone: 'desc' } }
  })
}
