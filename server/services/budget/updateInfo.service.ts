import { SecurityRuleContext } from '~/server/security'
import { BudgetRepo } from '~/server/database/repository'
import { UpdateBudgetInfoInput } from '~/server/schema'

export async function updateInfo({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: UpdateBudgetInfoInput
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { remainingAfterExpenses, ...data } = input
  return await BudgetRepo.update(ctx.user, {
    where: { id: input.id },
    data,
    select: { id: true }
  })
}
