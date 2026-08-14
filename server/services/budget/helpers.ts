import type {
  IncomeKey,
  ExpensesKey,
  BudgetExpensesWithLoansAndDebts,
  BudgetIncomeWithCustoms
} from '~~/types/budget'
import { budgetIncomeKeys, budgetExpensesKeys } from '~~/client/options'
import { incrementBudgetTotal } from '~/utils/budget'

export const getTotalIncome = (incomes: BudgetIncomeWithCustoms[]) => {
  const regularIncomes = incomes.reduce<number | null>((acc, income) => {
    const total = budgetIncomeKeys.keys.reduce<number | null>(
      (iacc, key) => incrementBudgetTotal(iacc, income[key as IncomeKey]),
      null
    )
    return incrementBudgetTotal(acc, total)
  }, null)

  const customIncomes = incomes.reduce<number | null>((acc, income) => {
    const total =
      income.customs.reduce<number | null>(
        (acc, cur) => incrementBudgetTotal(acc, cur.amount),
        null
      ) || 0
    return incrementBudgetTotal(acc, total)
  }, null)

  if (!regularIncomes && !customIncomes) {
    return null
  }

  return (regularIncomes || 0) + (customIncomes || 0)
}

export function getTotalExpenses(expenses: BudgetExpensesWithLoansAndDebts) {
  const main = budgetExpensesKeys.keys.reduce<number | null>(
    (acc, cur) => incrementBudgetTotal(acc, expenses[cur as ExpensesKey]),
    null
  )

  const loans = expenses.loans.reduce<number | null>(
    (acc, cur) => incrementBudgetTotal(acc, cur.amountPerMonth),
    null
  )

  const debts = expenses.debts.reduce<number | null>(
    (acc, cur) => incrementBudgetTotal(acc, cur.amountPerMonth),
    null
  )

  const customExpenses = expenses.customs.reduce<number | null>(
    (acc, cur) => incrementBudgetTotal(acc, cur.amount),
    null
  )

  return main === null &&
    loans === null &&
    debts === null &&
    customExpenses === null
    ? null
    : (main || 0) + (loans || 0) + (debts || 0) + (customExpenses || 0)
}

export function getDeltaIncomeExpenses(
  incomes: BudgetIncomeWithCustoms[],
  expenses: BudgetExpensesWithLoansAndDebts | null
) {
  const totalIncome = getTotalIncome(incomes)
  const totalExpenses = expenses ? getTotalExpenses(expenses) : null

  const deltaIncomeExpenses =
    totalIncome === null || totalExpenses === null
      ? null
      : totalIncome - totalExpenses

  return deltaIncomeExpenses
}
