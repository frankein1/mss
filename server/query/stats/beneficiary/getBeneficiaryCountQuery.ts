import { BeneficiaryRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security'
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
