import { breadcrumbs as ben } from './beneficiary'
import type { BeneficiaryIdentification } from '~/types/beneficiary'
import { routes } from '~/routes'

const r = routes.budget
type Routes = typeof r

function getBread<
  T extends 'AppFileBudgetExpensesEdit' | 'AppBeneficiaryBudgetIncomeEdit'
>(name: T, beneficiary: BeneficiaryIdentification | null, id: string) {
  const title = r[name].title as Routes[T]['title']
  return [{ text: title, to: r[name].path(beneficiary?.id || '', id) }]
}

function getBreadWithBeneficiary<T extends 'AppFileBudgetInfoEdit'>(
  name: T,
  beneficiary: BeneficiaryIdentification | null
) {
  const title = r[name].title as Routes[T]['title']
  return [{ text: title, to: r[name].path(beneficiary?.id || '') }]
}

export const breadcrumbs = {
  AppFileBudgetInfoEdit: (beneficiary: BeneficiaryIdentification | null) => [
    ...ben.AppBeneficiary(beneficiary),
    ...getBreadWithBeneficiary('AppFileBudgetInfoEdit', beneficiary)
  ],
  AppFileBudgetExpensesEdit: (
    beneficiary: BeneficiaryIdentification | null,
    expensesId: string
  ) => [
    ...ben.AppBeneficiary(beneficiary),
    ...getBread('AppFileBudgetExpensesEdit', beneficiary, expensesId)
  ],
  AppBeneficiaryBudgetIncomeEdit: (
    beneficiary: BeneficiaryIdentification | null,
    incomeId: string
  ) => [
    ...ben.AppBeneficiary(beneficiary),
    ...getBread('AppFileBudgetExpensesEdit', beneficiary, incomeId)
  ]
}
