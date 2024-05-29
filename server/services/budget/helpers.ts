import {
  IncomeKey,
  ExpensesKey,
  BudgetIncome,
  BudgetExpensesWithLoansAndDebts
} from '~/types/budget'
import { budgetIncomeKeys, budgetExpensesKeys } from '~/client/options'
import { incrementBudgetTotal } from '~/utils/budget'

function getTotalIncome(incomes: BudgetIncome[]) {
  return incomes.reduce<number | null>((acc, income) => {
    const total = budgetIncomeKeys.keys.reduce<number | null>(
      (iacc, key) => incrementBudgetTotal(iacc, income[key as IncomeKey]),
      null
    )
    return incrementBudgetTotal(acc, total)
  }, null)
}

function getTotalExpenses(expenses: BudgetExpensesWithLoansAndDebts) {
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

  return main === null && loans === null && debts === null
    ? null
    : (main || 0) + (loans || 0) + (debts || 0)
}

export function getDeltaIncomeExpenses(
  incomes: BudgetIncome[],
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
