import type { SecurityRuleContext } from '~/server/security'
import { BudgetRepo } from '~/server/database/repository'
import type { UpdateBudgetInfoInput } from '~/server/schema'

export async function updateInfo({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: UpdateBudgetInfoInput
}) {
  const { remainingAfterExpenses, ...data } = input
  return await BudgetRepo.update(ctx.user, {
    where: { id: input.id },
    data,
    select: { id: true }
  })
}
