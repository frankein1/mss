import {
  GetIncomeHouseholdMemberBudget,
  GetBudgetIncomeHouseholdMember,
  IncomeKey
} from '~/types/budget'
import { budgetIncomeKeys } from '~/client/options'

/** Checks that at least one income source has been filled by user */
export function incomeHasBeenFilled(
  income: GetBudgetIncomeHouseholdMember | GetIncomeHouseholdMemberBudget
) {
  return budgetIncomeKeys.keys.some(key => {
    const incomeSource = income?.[key as IncomeKey]
    return incomeSource !== null && incomeSource !== undefined
  })
}
