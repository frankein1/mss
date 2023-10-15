import { BeneficiaryRepo } from '~/server/repository'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareBeneficiaryStatFilters } from '~/utils/filters'

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
