import { budgetExpensesKeys, budgetIncomeKeys } from '~/client/options'
import { prismaDecimalToNumber } from '~/utils/prisma'
import {
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
  const regularExpenses = keys.map(key => {
    return {
      label: budgetExpensesKeys.value(key) || '',
      value: expenses[key as ExpensesKey]?.toFixed(0) || '0'
    }
  })
  const customExpenses = expenses.customs.map(expense => {
    return {
      label: expense.type || '',
      value: expense.amount?.toFixed(0) || '0'
    }
  })
  return [...regularExpenses, ...customExpenses]
}

export const getIncomeRows = (income: BudgetIncomeWithCustoms | null) => {
  if (!income) {
    return []
  }
  const keys = budgetIncomeKeys.keys.filter(
    key => (prismaDecimalToNumber(income[key as IncomeKey]) || 0) > 0
  )
  const regularIncome = keys.map(key => {
    return {
      label: budgetIncomeKeys.value(key) || '',
      value: income[key as IncomeKey]?.toFixed(0) || '0'
    }
  })

  const customIncome = income.customs.map(custom => ({
    label: custom.type || '',
    value: custom.amount?.toFixed(0) || '0'
  }))

  return [...regularIncome, ...customIncome]
}
