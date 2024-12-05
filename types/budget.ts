import type {
  BudgetExpenses,
  BudgetIncome,
  BeneficiaryRelative,
  Budget,
  BudgetExpensesDebt,
  BudgetExpensesLoan,
  BudgetExpensesCustom,
  BudgetIncomeCustom
} from '@prisma/client'
import { BeneficiaryFileIdentification } from './beneficiary'
import { custom } from 'zod'

export type ExpensesKey = keyof Omit<
  BudgetExpenses,
  'id' | 'budgetId' | 'loans' | 'debts' | 'created' | 'updated'
>
export type IncomeKey = keyof Omit<
  BudgetIncome,
  | 'id'
  | 'budgetId'
  | 'type'
  | 'created'
  | 'updated'
  | 'beneficiaryId'
  | 'lastName'
  | 'firstName'
  | 'relationship'
>

export type GetIncomeHouseholdMemberBudget = BudgetIncome & {
  householdMember: BeneficiaryRelative | null
  budget: Budget | null
}

export type GetBudgetIncomeHouseholdMember = BudgetIncome & {
  beneficiary: BeneficiaryFileIdentification | null
} & {
  customs: BudgetIncomeCustom[]
}

export type BudgetExpensesWithLoansAndDebts = BudgetExpenses & {
  loans: BudgetExpensesLoan[]
  debts: BudgetExpensesDebt[]
  customs: BudgetExpensesCustom[]
}

export type BudgetIncomeWithCustoms = BudgetIncome & {
  customs: BudgetIncomeCustom[]
}

export { BudgetExpenses, BudgetIncome }
