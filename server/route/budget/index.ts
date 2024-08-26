import { updateInfo } from './updateInfo.mutation'
import { updateIncome } from './updateIncome.mutation'
import { deleteIncome } from './deleteIncome.mutation'
import { updateExpenses } from './updateExpenses.mutation'
import { getExpenses } from './getExpenses.query'
import { getIncome } from './getIncome.query'
import { getInfo } from './getInfo.query'
import { getBudget } from './getBudget.query'

export const budgetRoutes = {
  updateInfo,
  updateIncome,
  deleteIncome,
  updateExpenses,
  getExpenses,
  getIncome,
  getInfo,
  getBudget
}
