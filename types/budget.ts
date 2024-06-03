import type {
  BudgetExpenses,
  BudgetIncome,
  BeneficiaryRelative,
  Budget,
  BudgetExpensesDebt,
  BudgetExpensesLoan
} from '@prisma/client'

export type ExpensesKey = keyof Omit<
  BudgetExpenses,
  'id' | 'budgetId' | 'loans' | 'debts' | 'created' | 'updated'
>
export type IncomeKey = keyof Omit<
  BudgetIncome,
  'id' | 'budgetId' | 'type' | 'householdMemberId' | 'created' | 'updated'
>

export type GetIncomeHouseholdMemberBudget = BudgetIncome & {
  householdMember: BeneficiaryRelative | null
  budget: Budget | null
}

export type GetBudgetIncomeHouseholdMember = BudgetIncome & {
  householdMember: BeneficiaryRelative | null
}

export type BudgetExpensesWithLoansAndDebts = BudgetExpenses & {
  loans: BudgetExpensesLoan[]
  debts: BudgetExpensesDebt[]
}

export { BudgetExpenses, BudgetIncome }
