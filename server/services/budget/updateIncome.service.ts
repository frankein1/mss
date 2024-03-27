import { SecurityRuleContext } from '~/server/security'
import { BudgetRepo } from '~/server/database/repository'
import { UpdateBudgetInfoInput } from '~/server/schema'

export async function updateIncome({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: UpdateBudgetInfoInput
}) {
  return await BudgetRepo.update(ctx.user, {
    where: { id: input.id },
    data: input,
    select: { id: true }
  })
}
