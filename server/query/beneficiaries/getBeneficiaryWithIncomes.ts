import { BeneficiaryRepo } from '~/server/database'
import { SecurityRuleGrantee } from '~/server/security'

export function getBeneficiaryWithIncomes(
  user: SecurityRuleGrantee,
  id: string
) {
  return BeneficiaryRepo.findUniqueOrThrow(user, {
    where: { id },
    select: {
      id: true,
      incomes: true
    }
  })
}
