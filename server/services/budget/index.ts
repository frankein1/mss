import { updateInfo } from './updateInfo.service'
import { updateExpenses } from './updateExpenses.service'
import { updateIncome } from './updateIncome.service'
import { getIncome } from './getIncome.service'
import { getExpenses } from './getExpenses.service'
import { getInfo } from './getInfo.service'
import { getBudget } from './getBudget.service'
import { getBudgetId } from './getBudgetId.service'

export const BudgetService = {
  updateInfo,
  updateExpenses,
  updateIncome,
  getIncome,
  getExpenses,
  getInfo,
  getBudget,
  getBudgetId
}
