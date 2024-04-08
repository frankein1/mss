import type { BudgetExpenses, BudgetIncome } from '@prisma/client'

export type ExpensesKey = keyof Omit<BudgetExpenses, 'id' | 'budgetId'>
export type IncomeKey = keyof Omit<
  BudgetIncome,
  'id' | 'budgetId' | 'type' | 'beneficiaryRelativeId'
>

export { BudgetExpenses, BudgetIncome }
