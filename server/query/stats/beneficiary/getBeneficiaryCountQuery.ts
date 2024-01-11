import { prepareBeneficiaryStatFilters } from '../helpers'
import { BeneficiaryRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getBeneficiaryCountQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  return await BeneficiaryRepo.count(user, {
    where: {
      ...prepareBeneficiaryStatFilters(input)
    }
  })
}
