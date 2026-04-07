import type { SecurityRuleContext } from '~/server/security'
import { BudgetExpensesRepo } from '~/server/database/repository'

export async function getExpenses({
  ctx,
  id
}: {
  ctx: SecurityRuleContext
  id: string
}) {
  return await BudgetExpensesRepo.findUniqueOrThrow(ctx.user, {
    where: { id },
    select: {
      id: true,
      created: true,
      updated: true,
      budgetId: true,
      rent: true,
      expenses: true,
      water: true,
      electricity: true,
      gas: true,
      fuelOrOther: true,
      housingTax: true,
      propertyTax: true,
      incomeTax: true,
      carInsurance: true,
      homeInsurance: true,
      deathInsurance: true,
      retirementInsurance: true,
      otherInsurance: true,
      remittedAlimony: true,
      healthInsurance: true,
      phoneInternet: true,
      schoolFees: true,
      schoolCanteen: true,
      other: true,
      loans: { orderBy: { created: 'asc' } },
      debts: { orderBy: { created: 'asc' } },
      customs: { orderBy: { created: 'asc' } }
    }
  })
}
