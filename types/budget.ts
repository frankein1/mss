import type {
  BudgetExpenses,
  BudgetIncome,
  BeneficiaryRelative,
  Budget
} from '@prisma/client'

export type ExpensesKey = keyof Omit<BudgetExpenses, 'id' | 'budgetId'>
export type IncomeKey = keyof Omit<
  BudgetIncome,
  'id' | 'budgetId' | 'type' | 'householdMemberId'
>

export type GetIncomeHouseholdMemberBudget = BudgetIncome & {
  householdMember: BeneficiaryRelative | null
  budget: Budget | null
}

export type GetBudgetIncomeHouseholdMember = BudgetIncome & {
  householdMember: BeneficiaryRelative | null
}

export { BudgetExpenses, BudgetIncome }
