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
      beneficiary: {
        select: {
          id: true,
          firstName: true,
          usualName: true,
          birthName: true,
          birthDate: true,
          relationship: true
        }
      },
      budget: true
    }
  })
}
