import { afterEach, beforeEach, describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  FixtureBeneficiary,
  FixtureStructure,
  fixturesBeneficiaries,
  fixturesBudgets,
  fixtureStructures
} from '~/prisma/fixtures'
import { prismaClient } from '~/server/prisma'

const ownStructureBudgetId = fixturesBudgets[FixtureBeneficiary.TEARLE].id
const otherStructureBudgetId = fixturesBudgets[FixtureBeneficiary.MARTIN].id

let otherStructureBeneficiaryId: string
let ownStructureBeneficiaryId: string

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
  await prismaClient.budgetIncome.deleteMany({
    where: {
      beneficiaryId: {
        in: [otherStructureBeneficiaryId, ownStructureBeneficiaryId]
      }
    }
  })
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
  expect(income.id).toBeDefined()
})

describe('Authorizations', () => {
  test('rejects when budget belongs to another structure', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.budget.createBudgetIncome({
        budgetId: otherStructureBudgetId,
        beneficiaryId: otherStructureBeneficiaryId
      })
    ).rejects.toThrowError(/not allowed to access route/i)
  })

  test('rejects when beneficiary belongs to another structure', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManager.budget.createBudgetIncome({
        budgetId: ownStructureBudgetId,
        beneficiaryId: otherStructureBeneficiaryId
      })
    ).rejects.toThrowError(/not allowed to access route/i)
  })

  test('rejects when caller belongs to another structure', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManagerMinistere.budget.createBudgetIncome({
        budgetId: ownStructureBudgetId,
        beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.TEARLE].id
      })
    ).rejects.toThrowError(/not allowed to access route/i)
  })
})
