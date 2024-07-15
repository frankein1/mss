import { BeneficiariesRoute, FilesRoute } from './utils'

export const routes = {
  AppFileBudgetInfoEdit: {
    name: 'AppFileBudgetInfoEdit',
    title: 'Modifier les informations générales du budget',
    path: (familyFileId: string) => `${FilesRoute}/${familyFileId}/budget/edit`
  },
  AppFileBudgetExpensesEdit: {
    name: 'AppFileBudgetExpensesEdit',
    title: 'Modifier les charges fixes mensuelles',
    path: (familyFileId: string, expensesId: string) =>
      `${FilesRoute}/${familyFileId}/expenses/${expensesId}/edit`
  },
  AppBeneficiaryBudgetIncomeEdit: {
    name: 'AppBeneficiaryBudgetIncomeEdit',
    title: 'Modifier les revenus mensuels',
    path: (beneficiaryId: string, incomeId: string) =>
      `${BeneficiariesRoute}/${beneficiaryId}/income/${incomeId}/edit`
  }
}
