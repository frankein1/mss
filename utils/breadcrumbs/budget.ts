import { breadcrumbs as file } from './file'
import type { BeneficiaryNames } from '~/types/beneficiary'
import { routes } from '~/utils/routes'

const r = routes.budget
type Routes = typeof r

function getBread<
  T extends 'AppFileBudgetExpensesEdit' | 'AppFileBudgetIncomeEdit'
>(name: T, familyFileId: string, id: string) {
  const title = r[name].title as Routes[T]['title']
  return [{ text: title, to: r[name].path(familyFileId, id) }]
}

function getBreadWithFileId<T extends 'AppFileBudgetInfoEdit'>(
  name: T,
  familyFileId: string
) {
  const title = r[name].title as Routes[T]['title']
  return [{ text: title, to: r[name].path(familyFileId) }]
}

export const breadcrumbs = {
  AppFileBudgetInfoEdit: (
    familyFileId: string,
    familyIdentification: BeneficiaryNames[] | null
  ) => [
    ...file.AppFile(familyFileId, familyIdentification),
    ...getBreadWithFileId('AppFileBudgetInfoEdit', familyFileId)
  ],
  AppFileBudgetExpensesEdit: (
    familyFileId: string,
    familyIdentification: BeneficiaryNames[] | null,
    expensesId: string
  ) => [
    ...file.AppFile(familyFileId, familyIdentification),
    ...getBread('AppFileBudgetExpensesEdit', familyFileId, expensesId)
  ],
  AppFileBudgetIncomeEdit: (
    familyFileId: string,
    familyIdentification: BeneficiaryNames[] | null,
    incomeId: string
  ) => [
    ...file.AppFile(familyFileId, familyIdentification),
    ...getBread('AppFileBudgetIncomeEdit', familyFileId, incomeId)
  ]
}
