import { RouterOutput } from '~/server/trpc/routers'

export type Budget = RouterOutput['budget']['getBudget']

export type BudgetExpenses = NonNullable<Budget['expenses']>
export type BudgetIncome = NonNullable<Budget['incomes']>

export type { ExpensesKey, IncomeKey } from '~/types/budget'
