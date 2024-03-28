import { updateInfo } from './updateInfo.mutation'
import { updateIncome } from './updateIncome.mutation'
import { updateExpenses } from './updateExpenses.mutation'
import { getExpenses } from './getExpenses.query'
import { getIncome } from './getIncome.query'
import { getInfo } from './getInfo.query'
import { getBudget } from './getBudget.query'
import { getBudgetId } from './getBudgetId.query'

export const budgetRoutes = {
  updateInfo,
  updateIncome,
  updateExpenses,
  getExpenses,
  getIncome,
  getInfo,
  getBudget,
  getBudgetId
}
