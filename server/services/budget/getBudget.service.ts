import { SecurityRuleContext } from '~/server/security'
import { BudgetRepo } from '~/server/database/repository'

export async function getBudget({
  ctx,
  beneficiaryId
}: {
  ctx: SecurityRuleContext
  beneficiaryId: string
}) {
  return await BudgetRepo.findUniqueOrThrow(ctx.user, {
    where: { beneficiaryId },
    include: {
      expenses: true,
      incomes: true
    }
  })
}
