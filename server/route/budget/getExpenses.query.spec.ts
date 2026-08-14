import { expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import {
  describeBudgetAuthorizations,
  budgetFixtures
} from './budget-test-helpers'

describeBudgetAuthorizations('getExpenses', {
  ownStructure: caller =>
    caller.budget.getExpenses({ id: budgetFixtures.ownStructure.expensesId }),
  otherStructure: caller =>
    caller.budget.getExpenses({ id: budgetFixtures.otherStructure.expensesId }),
  referentAssigned: caller =>
    caller.budget.getExpenses({
      id: budgetFixtures.referentAssigned.expensesId
    })
})

test('getExpenses - returns expenses with loans, debts and customs', async ({
  trpc
}) => {
  const result = await trpc.structureManager.budget.getExpenses({
    id: budgetFixtures.ownStructure.expensesId
  })

  expect(result.id).toBe(budgetFixtures.ownStructure.expensesId)
  expect(result.budgetId).toBe(budgetFixtures.ownStructure.budgetId)
  expect(result).toHaveProperty('rent')
  expect(result).toHaveProperty('electricity')
  expect(result).toHaveProperty('loans')
  expect(result).toHaveProperty('debts')
  expect(result).toHaveProperty('customs')
})
