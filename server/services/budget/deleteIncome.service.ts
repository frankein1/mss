import { SecurityRuleContext } from '~/server/security'
import { BudgetIncomeRepo } from '~/server/database/repository'
import { IdInput } from '~/server/schema'

export async function deleteIncome({
  ctx: _ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: IdInput
}) {
  return await BudgetIncomeRepo.prisma.delete({
    where: { id: input.id }
  })
}
