import { expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  describeBudgetAuthorizations,
  budgetFixtures
} from './budget-test-helpers'

describeBudgetAuthorizations('getInfo', {
  ownStructure: caller =>
    caller.budget.getInfo({
      familyFileId: budgetFixtures.ownStructure.familyFileId
    }),
  otherStructure: caller =>
    caller.budget.getInfo({
      familyFileId: budgetFixtures.otherStructure.familyFileId
    }),
  referentAssigned: caller =>
    caller.budget.getInfo({
      familyFileId: budgetFixtures.referentAssigned.familyFileId
    })
})

test('getInfo - returns budget info with incomes and expenses summary', async ({
  trpc
}) => {
  const result = await trpc.structureManager.budget.getInfo({
    familyFileId: budgetFixtures.ownStructure.familyFileId
  })

  expect(result.id).toBe(budgetFixtures.ownStructure.budgetId)
  expect(result.familyFileId).toBe(budgetFixtures.ownStructure.familyFileId)
  expect(result).toHaveProperty('deltaIncomeExpenses')
  expect(result).toHaveProperty('numberHouseholdMembers')
  expect(result).toHaveProperty('savings')
  expect(result).toHaveProperty('overdraft')
  expect(result).toHaveProperty('familyQuotient')
  expect(result).toHaveProperty('banqueDeFrance')
})
