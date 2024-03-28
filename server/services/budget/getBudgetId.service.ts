import { SecurityRuleContext } from '~/server/security'
import { BudgetRepo } from '~/server/database/repository'

export async function getBudgetId({
  ctx,
  beneficiaryId
}: {
  ctx: SecurityRuleContext
  beneficiaryId: string
}) {
  return await BudgetRepo.findUniqueOrThrow(ctx.user, {
    where: { beneficiaryId },
    select: { id: true }
  })
}
