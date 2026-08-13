import { describe, test, expect } from 'vitest'
import { routes } from './budget'

describe('budget routes', () => {
  test('AppFileBudgetInfoEdit path returns /app/files/:id/budget/edit', () => {
    expect(routes.AppFileBudgetInfoEdit.path('file-1')).toBe(
      '/app/files/file-1/budget/edit'
    )
  })

  test('AppFileBudgetExpensesEdit path returns /app/files/:fileId/expenses/:expensesId/edit', () => {
    expect(routes.AppFileBudgetExpensesEdit.path('file-1', 'expense-1')).toBe(
      '/app/files/file-1/expenses/expense-1/edit'
    )
  })

  test('AppFileBudgetIncomeEdit path returns /app/files/:fileId/income/:incomeId/edit', () => {
    expect(routes.AppFileBudgetIncomeEdit.path('file-1', 'income-1')).toBe(
      '/app/files/file-1/income/income-1/edit'
    )
  })
})
