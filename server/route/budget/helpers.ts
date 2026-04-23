import { budgetExpensesKeys, budgetIncomeKeys } from '~/client/options'
import { prismaDecimalToNumber } from '~/utils/prisma'
import type {
  BudgetExpensesWithLoansAndDebts,
  BudgetIncomeWithCustoms,
  ExpensesKey,
  IncomeKey
} from '~/types/budget'

export const getExpensesRows = (
  expenses: BudgetExpensesWithLoansAndDebts | null
) => {
  if (!expenses) {
    return []
  }
  const keys = budgetExpensesKeys.keys.filter(
    key => (prismaDecimalToNumber(expenses[key as ExpensesKey]) || 0) > 0
  )
  const regularExpenses = keys.map(key => ({
    label: budgetExpensesKeys.value(key) || '',
    value: prismaDecimalToNumber(expenses[key as ExpensesKey]) ?? 0
  }))
  const customExpenses = expenses.customs.map(expense => ({
    label: expense.type || '',
    value: prismaDecimalToNumber(expense.amount) ?? 0
  }))
  return [...regularExpenses, ...customExpenses]
}

export const getIncomeRows = (income: BudgetIncomeWithCustoms | null) => {
  if (!income) {
    return []
  }
  const keys = budgetIncomeKeys.keys.filter(
    key => (prismaDecimalToNumber(income[key as IncomeKey]) || 0) > 0
  )
  const regularIncome = keys.map(key => ({
    label: budgetIncomeKeys.value(key) || '',
    value: prismaDecimalToNumber(income[key as IncomeKey]) ?? 0
  }))
  const customIncome = income.customs.map(custom => ({
    label: custom.type || '',
    value: prismaDecimalToNumber(custom.amount) ?? 0
  }))
  return [...regularIncome, ...customIncome]
}

export const getRowTotal = (row: { value: number }[]) =>
  row.reduce((acc, cur) => acc + cur.value, 0)
