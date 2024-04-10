import { SecurityRuleContext } from '~/server/security'
import { BudgetIncomeRepo } from '~/server/database/repository'

export async function getIncome({
  ctx,
  id
}: {
  ctx: SecurityRuleContext
  id: string
}) {
  return await BudgetIncomeRepo.findUniqueOrThrow(ctx.user, {
    where: { id },
    include: {
      householdMember: true
    }
  })
}
