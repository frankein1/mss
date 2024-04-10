import type {
  BudgetExpenses,
  BudgetIncome,
  BeneficiaryRelative
} from '@prisma/client'

export type ExpensesKey = keyof Omit<BudgetExpenses, 'id' | 'budgetId'>
export type IncomeKey = keyof Omit<
  BudgetIncome,
  'id' | 'budgetId' | 'type' | 'householdMemberId'
>

export type GetIncomeHouseholdMember = BudgetIncome & {
  householdMember: BeneficiaryRelative | null
}

export { BudgetExpenses, BudgetIncome }
