import { SecurityRuleContext } from '~/server/security'
import { BudgetRepo } from '~/server/database/repository'

export async function getInfo({
  ctx,
  beneficiaryId
}: {
  ctx: SecurityRuleContext
  beneficiaryId: string
}) {
  return await BudgetRepo.findUniqueOrThrow(ctx.user, {
    where: { beneficiaryId }
  })
}
