import { FilesRoute } from './utils'

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
  AppFileBudgetIncomeEdit: {
    name: 'AppFileBudgetIncomeEdit',
    title: 'Modifier les revenus mensuels',
    path: (familyFileId: string, incomeId: string) =>
      `${FilesRoute}/${familyFileId}/income/${incomeId}/edit`
  }
} as const
