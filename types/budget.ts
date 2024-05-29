import type {
  BudgetExpenses,
  BudgetIncome,
  BeneficiaryRelative,
  Budget,
  BudgetExpensesDebts,
  BudgetExpensesLoans
} from '@prisma/client'

export type ExpensesKey = keyof Omit<
  BudgetExpenses,
  'id' | 'budgetId' | 'loans' | 'debts'
>
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

export type BudgetExpensesWithLoansAndDebts = BudgetExpenses & {
  loans: BudgetExpensesLoans[]
  debts: BudgetExpensesDebts[]
}

export { BudgetExpenses, BudgetIncome }
