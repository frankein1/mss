import { afterEach, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import { prismaClient } from '~/server/prisma'
import {
  describeBudgetAuthorizations,
  budgetFixtures
} from './budget-test-helpers'

describeBudgetAuthorizations('updateInfo', {
  ownStructure: caller =>
    caller.budget.updateInfo({ id: budgetFixtures.ownStructure.budgetId }),
  otherStructure: caller =>
    caller.budget.updateInfo({ id: budgetFixtures.otherStructure.budgetId }),
  referentAssigned: caller =>
    caller.budget.updateInfo({ id: budgetFixtures.referentAssigned.budgetId })
})

afterEach(async () => {
  await prismaClient.budget.update({
    where: { id: budgetFixtures.ownStructure.budgetId },
    data: { savings: null, overdraft: null, familyQuotient: null }
  })
})

test('updateInfo - persists updated budget info fields', async ({ trpc }) => {
  await trpc.structureManager.budget.updateInfo({
    id: budgetFixtures.ownStructure.budgetId,
    savings: 1500,
    overdraft: 200,
    familyQuotient: 850
  })

  const result = await trpc.structureManager.budget.getInfo({
    familyFileId: budgetFixtures.ownStructure.familyFileId
  })

  expect(Number(result.savings)).toBe(1500)
  expect(Number(result.overdraft)).toBe(200)
  expect(Number(result.familyQuotient)).toBe(850)
})
