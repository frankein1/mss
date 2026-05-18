import { describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import { FixtureBeneficiary, fixturesBeneficiaries } from '~/prisma/fixtures'

const familyFileId = fixturesBeneficiaries[FixtureBeneficiary.TEARLE].id
const coursorFamilyFileId = fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id
const familyFileIdAutreStructure =
  fixturesBeneficiaries[FixtureBeneficiary.MARTIN].id

describe('Authorizations', () => {
  test('getBudget - a structure manager can access the budget', async ({
    trpc
  }) => {
    const result = await trpc.structureManager.budget.getBudget({
      familyFileId
    })
    expect(result).toBeDefined()
  })

  test('getBudget - a social worker can access the budget', async ({
    trpc
  }) => {
    const result = await trpc.socialWorker.budget.getBudget({ familyFileId })
    expect(result).toBeDefined()
  })

  test('getBudget - a reception agent cannot access the budget', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.receptionAgent.budget.getBudget({ familyFileId })
    ).rejects.toThrowError(/not allowed to access route/i)
  })

  test('getBudget - an administrator cannot access the budget', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.administrator.budget.getBudget({ familyFileId })
    ).rejects.toThrowError(/user routes are not available to admins/i)
  })

  test('getBudget - a structure manager cannot access the budget of another structure', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManager.budget.getBudget({
        familyFileId: familyFileIdAutreStructure
      })
    ).rejects.toThrowError(/budget[\s\S]*?no record/im)
  })

  test('getBudget - a referent cannot access the budget if not assigned to the family file', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.referent.budget.getBudget({
        familyFileId
      })
    ).rejects.toThrowError(/budget[\s\S]*?no record/im)
  })

  test('getBudget - a referent can access the budget if assigned to the family file', async ({
    trpc
  }) => {
    const result = await trpc.referent.budget.getBudget({
      familyFileId: coursorFamilyFileId
    })
    expect(result).toBeDefined()
  })
})
