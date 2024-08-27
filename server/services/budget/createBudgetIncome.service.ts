import { BudgetIncomeType } from '@prisma/client'
import { BudgetIncomeRepo } from '~/server/database'
import { CreateBudgetIncomeInput } from '~/server/schema'

export async function createBudgetIncome(input: CreateBudgetIncomeInput) {
  const { budgetId, ...memberData } = input

  const income = await BudgetIncomeRepo.prisma.create({
    data: {
      type: BudgetIncomeType.HouseholdMember,
      budgetId,
      ...memberData
    },
    select: { id: true }
  })

  return { id: income.id }
}
