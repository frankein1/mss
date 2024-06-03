import { SecurityRuleContext } from '~/server/security'
import { BudgetExpensesRepo } from '~/server/database/repository'

export async function getExpenses({
  ctx,
  id
}: {
  ctx: SecurityRuleContext
  id: string
}) {
  return await BudgetExpensesRepo.findUniqueOrThrow(ctx.user, {
    where: { id },
    include: {
      loans: { orderBy: { created: 'asc' } },
      debts: { orderBy: { created: 'asc' } }
    }
  })
}
