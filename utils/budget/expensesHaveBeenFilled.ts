import { BudgetExpenses, ExpensesKey } from '~/types/budget'
import { budgetExpensesKeys } from '~/client/options'

/** Checks that at least one income source has been filled by user */
export function expensesHaveBeenFilled(expenses: BudgetExpenses) {
  return budgetExpensesKeys.keys.some(key => {
    const expensesSource = expenses?.[key as ExpensesKey]
    return expensesSource !== null && expensesSource !== undefined
  })
}
