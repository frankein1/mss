import { afterEach, beforeEach, describe, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import {
  FixtureBeneficiary,
  FixtureStructure,
  fixturesBeneficiaries,
  fixturesBudgets,
  fixtureStructures
} from '~~/prisma/fixtures'
import { prismaClient } from '~~/server/prisma'
import { budgetFixtures } from './budget-test-helpers'
import { BUDGET_INCOME_FOR_MEMBER_VALUE } from '~/utils/constants/income'

const ownStructureBudgetId = fixturesBudgets[FixtureBeneficiary.TEARLE].id
const otherStructureBudgetId = fixturesBudgets[FixtureBeneficiary.MARTIN].id
const referentAssignedBudgetId = fixturesBudgets[FixtureBeneficiary.COURSOR].id

let otherStructureBeneficiaryId: string
let ownStructureBeneficiaryId: string

const createdIncomeIds: string[] = []

beforeEach(async () => {
  const [otherBeneficiary, ownBeneficiary] = await Promise.all([
    prismaClient.beneficiary.create({
      select: { id: true },
      data: {
        fileNumber: `CROSS-STRUCT-${Date.now()}`,
        status: 'Active',
        structureId: fixtureStructures[FixtureStructure.Ministère].id,
        familyFileId:
          fixturesBeneficiaries[FixtureBeneficiary.MARTIN].familyFileId
      }
    }),
    prismaClient.beneficiary.create({
      select: { id: true },
      data: {
        fileNumber: `OWN-STRUCT-${Date.now()}`,
        status: 'Active',
        structureId: fixtureStructures[FixtureStructure.Test].id,
        familyFileId:
          fixturesBeneficiaries[FixtureBeneficiary.TEARLE].familyFileId
      }
    })
  ])
  otherStructureBeneficiaryId = otherBeneficiary.id
  ownStructureBeneficiaryId = ownBeneficiary.id
})

afterEach(async () => {
  if (createdIncomeIds.length > 0) {
    await prismaClient.budgetIncome.deleteMany({
      where: { id: { in: createdIncomeIds } }
    })
    createdIncomeIds.length = 0
  }
  await prismaClient.beneficiary.deleteMany({
    where: {
      id: { in: [otherStructureBeneficiaryId, ownStructureBeneficiaryId] }
    }
  })
})

test('creates an income for a beneficiary in the same structure', async ({
  trpc
}) => {
  const income = await trpc.structureManager.budget.createBudgetIncome({
    budgetId: ownStructureBudgetId,
    beneficiaryId: ownStructureBeneficiaryId
  })
  createdIncomeIds.push(income.id)
  expect(income.id).toBeDefined()
})

describe('Authorizations', () => {
  test('a structure manager can create a budget income', async ({ trpc }) => {
    const income = await trpc.structureManager.budget.createBudgetIncome({
      budgetId: ownStructureBudgetId,
      beneficiaryId: ownStructureBeneficiaryId
    })
    createdIncomeIds.push(income.id)
    expect(income.id).toBeDefined()
  })

  test('a social worker can create a budget income', async ({ trpc }) => {
    const income = await trpc.socialWorker.budget.createBudgetIncome({
      budgetId: ownStructureBudgetId,
      beneficiaryId: ownStructureBeneficiaryId
    })
    createdIncomeIds.push(income.id)
    expect(income.id).toBeDefined()
  })

  test('a referent can create a budget income if assigned to the family file', async ({
    trpc
  }) => {
    const income = await trpc.referent.budget.createBudgetIncome({
      budgetId: referentAssignedBudgetId,
      beneficiaryId: BUDGET_INCOME_FOR_MEMBER_VALUE,
      member: {
        lastName: 'Test',
        firstName: 'Member',
        relationship: 'Conjoint'
      }
    })
    createdIncomeIds.push(income.id)
    expect(income.id).toBeDefined()
  })

  test('a reception agent cannot create a budget income', async ({ trpc }) => {
    await expect(() =>
      trpc.receptionAgent.budget.createBudgetIncome({
        budgetId: ownStructureBudgetId,
        beneficiaryId: ownStructureBeneficiaryId
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('an administrator cannot create a budget income', async ({ trpc }) => {
    await expect(() =>
      trpc.administrator.budget.createBudgetIncome({
        budgetId: ownStructureBudgetId,
        beneficiaryId: ownStructureBeneficiaryId
      })
    ).rejects.toThrow(/user routes are not available to admins/i)
  })

  test('a referent cannot create a budget income if not assigned to the family file', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.referent.budget.createBudgetIncome({
        budgetId: budgetFixtures.ownStructure.budgetId,
        beneficiaryId: BUDGET_INCOME_FOR_MEMBER_VALUE,
        member: {
          lastName: 'Test',
          firstName: 'Member',
          relationship: 'Conjoint'
        }
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('rejects when budget belongs to another structure', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.budget.createBudgetIncome({
        budgetId: otherStructureBudgetId,
        beneficiaryId: otherStructureBeneficiaryId
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('rejects when beneficiary belongs to another structure', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManager.budget.createBudgetIncome({
        budgetId: ownStructureBudgetId,
        beneficiaryId: otherStructureBeneficiaryId
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('rejects when caller belongs to another structure', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManagerMinistere.budget.createBudgetIncome({
        budgetId: ownStructureBudgetId,
        beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.TEARLE].id
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })
})
