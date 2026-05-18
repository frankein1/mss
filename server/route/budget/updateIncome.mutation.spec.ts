import { afterEach, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import { prismaClient } from '~/server/prisma'
import {
  describeBudgetAuthorizations,
  budgetFixtures
} from './budget-test-helpers'

describeBudgetAuthorizations('updateIncome', {
  ownStructure: caller =>
    caller.budget.updateIncome({
      id: budgetFixtures.ownStructure.incomeId,
      customs: []
    }),
  otherStructure: caller =>
    caller.budget.updateIncome({
      id: budgetFixtures.otherStructure.incomeId,
      customs: []
    }),
  referentAssigned: caller =>
    caller.budget.updateIncome({
      id: budgetFixtures.referentAssigned.incomeId,
      customs: []
    })
})

afterEach(async () => {
  await prismaClient.budgetIncome.update({
    where: { id: budgetFixtures.ownStructure.incomeId },
    data: { salary: null, rsa: null }
  })
})

test('updateIncome - persists updated income fields', async ({ trpc }) => {
  await trpc.structureManager.budget.updateIncome({
    id: budgetFixtures.ownStructure.incomeId,
    salary: 2500,
    rsa: 600,
    customs: []
  })

  const result = await trpc.structureManager.budget.getIncome({
    id: budgetFixtures.ownStructure.incomeId
  })

  expect(Number(result.salary)).toBe(2500)
  expect(Number(result.rsa)).toBe(600)
})
