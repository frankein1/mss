import { afterEach, beforeEach, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { prismaClient } from '~~/server/prisma'
import {
  describeBudgetAuthorizations,
  budgetFixtures
} from './budget-test-helpers'

let freshIncomeOwnStructure: string
let freshIncomeOtherStructure: string
let freshIncomeReferentAssigned: string

beforeEach(async () => {
  const [own, other, referent] = await Promise.all([
    prismaClient.budgetIncome.create({
      data: {
        budgetId: budgetFixtures.ownStructure.budgetId,
        type: 'HouseholdMember'
      },
      select: { id: true }
    }),
    prismaClient.budgetIncome.create({
      data: {
        budgetId: budgetFixtures.otherStructure.budgetId,
        type: 'HouseholdMember'
      },
      select: { id: true }
    }),
    prismaClient.budgetIncome.create({
      data: {
        budgetId: budgetFixtures.referentAssigned.budgetId,
        type: 'HouseholdMember'
      },
      select: { id: true }
    })
  ])
  freshIncomeOwnStructure = own.id
  freshIncomeOtherStructure = other.id
  freshIncomeReferentAssigned = referent.id
})

afterEach(async () => {
  await prismaClient.budgetIncome
    .deleteMany({
      where: {
        id: {
          in: [
            freshIncomeOwnStructure,
            freshIncomeOtherStructure,
            freshIncomeReferentAssigned
          ]
        }
      }
    })
    .catch(() => {})
})

describeBudgetAuthorizations('deleteIncome', {
  ownStructure: caller =>
    caller.budget.deleteIncome({ id: freshIncomeOwnStructure }),
  otherStructure: caller =>
    caller.budget.deleteIncome({ id: freshIncomeOtherStructure }),
  referentAssigned: caller =>
    caller.budget.deleteIncome({ id: freshIncomeReferentAssigned })
})

test('deleteIncome - removes the income and updates budget timestamp', async ({
  trpc
}) => {
  const budgetBefore = await prismaClient.budget.findUniqueOrThrow({
    where: { id: budgetFixtures.ownStructure.budgetId },
    select: { updated: true }
  })

  await trpc.structureManager.budget.deleteIncome({
    id: freshIncomeOwnStructure
  })

  const deletedIncome = await prismaClient.budgetIncome.findUnique({
    where: { id: freshIncomeOwnStructure }
  })
  expect(deletedIncome).toBeNull()

  const budgetAfter = await prismaClient.budget.findUniqueOrThrow({
    where: { id: budgetFixtures.ownStructure.budgetId },
    select: { updated: true }
  })
  const updated = budgetAfter.updated!
  expect(updated).toBeTruthy()
  expect(updated.getTime()).toBeGreaterThan(budgetBefore.updated!.getTime())
})
