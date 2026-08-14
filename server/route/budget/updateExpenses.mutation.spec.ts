import { afterEach, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { prismaClient } from '~~/server/prisma'
import {
  describeBudgetAuthorizations,
  budgetFixtures
} from './budget-test-helpers'

describeBudgetAuthorizations('updateExpenses', {
  ownStructure: caller =>
    caller.budget.updateExpenses({
      id: budgetFixtures.ownStructure.expensesId,
      customs: [],
      loans: [],
      debts: []
    }),
  otherStructure: caller =>
    caller.budget.updateExpenses({
      id: budgetFixtures.otherStructure.expensesId,
      customs: [],
      loans: [],
      debts: []
    }),
  referentAssigned: caller =>
    caller.budget.updateExpenses({
      id: budgetFixtures.referentAssigned.expensesId,
      customs: [],
      loans: [],
      debts: []
    })
})

afterEach(async () => {
  await prismaClient.budgetExpenses.update({
    where: { id: budgetFixtures.ownStructure.expensesId },
    data: { rent: null, electricity: null }
  })
})

test('updateExpenses - persists updated expenses fields', async ({ trpc }) => {
  await trpc.structureManager.budget.updateExpenses({
    id: budgetFixtures.ownStructure.expensesId,
    rent: 800,
    electricity: 120,
    customs: [],
    loans: [],
    debts: []
  })

  const result = await trpc.structureManager.budget.getExpenses({
    id: budgetFixtures.ownStructure.expensesId
  })

  expect(Number(result.rent)).toBe(800)
  expect(Number(result.electricity)).toBe(120)
})
