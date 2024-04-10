import { SecurityRuleContext } from '~/server/security'
import { BudgetIncomeRepo } from '~/server/database/repository'
import { UpdateBudgetInfoInput } from '~/server/schema'

export async function updateIncome({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: UpdateBudgetInfoInput
}) {
  return await BudgetIncomeRepo.update(ctx.user, {
    where: { id: input.id },
    data: input,
    select: { id: true }
  })
}
