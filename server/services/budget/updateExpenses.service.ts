import { SecurityRuleContext } from '~/server/security'
import { BudgetExpensesRepo } from '~/server/database/repository'
import { UpdateBudgetExpensesInput } from '~/server/schema'

export async function updateExpenses({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: UpdateBudgetExpensesInput
}) {
  return await BudgetExpensesRepo.update(ctx.user, {
    where: { id: input.id },
    data: input,
    select: { id: true }
  })
}
