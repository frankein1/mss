import { expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import {
  describeBudgetAuthorizations,
  budgetFixtures
} from './budget-test-helpers'

describeBudgetAuthorizations('getIncome', {
  ownStructure: caller =>
    caller.budget.getIncome({ id: budgetFixtures.ownStructure.incomeId }),
  otherStructure: caller =>
    caller.budget.getIncome({ id: budgetFixtures.otherStructure.incomeId }),
  referentAssigned: caller =>
    caller.budget.getIncome({ id: budgetFixtures.referentAssigned.incomeId })
})

test('getIncome - returns income with beneficiary and budget details', async ({
  trpc
}) => {
  const result = await trpc.structureManager.budget.getIncome({
    id: budgetFixtures.ownStructure.incomeId
  })

  expect(result.id).toBe(budgetFixtures.ownStructure.incomeId)
  expect(result.budgetId).toBe(budgetFixtures.ownStructure.budgetId)
  expect(result).toHaveProperty('salary')
  expect(result).toHaveProperty('type')
  expect(result).toHaveProperty('customs')
  expect(result).toHaveProperty('beneficiary')
  expect(result).toHaveProperty('budget')
})
