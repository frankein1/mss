import { SecurityRuleContext } from '~/server/security'
import { BudgetRepo } from '~/server/database/repository'

export async function getBudget({
  ctx,
  id
}: {
  ctx: SecurityRuleContext
  id: string
}) {
  return await BudgetRepo.findUniqueOrThrow(ctx.user, {
    where: { id },
    include: {
      expenses: true,
      incomes: true
    }
  })
}
