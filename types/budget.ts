import type { BudgetExpenses } from '@prisma/client'

export type ExpensesKey = keyof Omit<BudgetExpenses, 'id' | 'budgetId'>

export { BudgetExpenses }
