import { budgetExpensesKeys, budgetIncomeKeys } from '~/client/options'
import { prismaDecimalToNumber } from '~/utils/prisma'
import type {
  BudgetExpensesWithLoansAndDebts,
  BudgetIncomeWithCustoms,
  ExpensesKey,
  IncomeKey
} from '~/types/budget'
import { incrementBudgetTotal } from '~/utils/budget'

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
      value: expenses[key as ExpensesKey]?.toFixed(2) + ' €' || '0'
    }
  })
  const customExpenses = expenses.customs.map(expense => {
    return {
      label: expense.type || '',
      value: expense.amount?.toFixed(2) + ' €' || '0'
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
      value: income[key as IncomeKey]?.toFixed(2) + ' €' || ''
    }
  })

  const customIncome = income.customs.map(custom => ({
    label: custom.type || '',
    value: custom.amount?.toFixed(2) + ' €' || ''
  }))

  return [...regularIncome, ...customIncome]
}

export const getRowTotal = (row: { label: string; value: string }[]) => {
  return (
    row.reduce<number | null>(
      (acc, cur) => incrementBudgetTotal(acc, cur.value),
      null
    ) || 0
  )
}
