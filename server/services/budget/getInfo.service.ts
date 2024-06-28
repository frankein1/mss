import { getDeltaIncomeExpenses } from './helpers'
import { SecurityRuleContext } from '~/server/security'
import { BudgetRepo } from '~/server/database/repository'

export async function getInfo({
  ctx,
  familyFileId
}: {
  ctx: SecurityRuleContext
  familyFileId: string
}) {
  const infos = await BudgetRepo.findUniqueOrThrow(ctx.user, {
    where: { familyFileId },
    include: {
      incomes: true,
      expenses: {
        include: {
          loans: true,
          debts: true
        }
      }
    }
  })

  const { incomes, expenses, ...data } = infos

  const deltaIncomeExpenses = getDeltaIncomeExpenses(incomes, expenses)

  return {
    ...data,
    deltaIncomeExpenses
  }
}
