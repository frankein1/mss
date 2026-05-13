import { describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import { FixtureBeneficiary, fixturesBeneficiaries } from '~/prisma/fixtures'

const familyFileId = fixturesBeneficiaries[FixtureBeneficiary.TEARLE].id
const coursorFamilyFileId = fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id
const familyFileIdAutreStructure =
  fixturesBeneficiaries[FixtureBeneficiary.MARTIN].id

describe('Authorizations', () => {
  test('getBudget - un responsable de structure peut accéder au budget', async ({
    trpc
  }) => {
    const result = await trpc.structureManager.budget.getBudget({
      familyFileId
    })
    expect(result).toBeDefined()
  })

  test('getBudget - un travailleur social peut accéder au budget', async ({
    trpc
  }) => {
    const result = await trpc.socialWorker.budget.getBudget({ familyFileId })
    expect(result).toBeDefined()
  })

  test('getBudget - un agent de réception ne peut pas accéder au budget', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.receptionAgent.budget.getBudget({ familyFileId })
    ).rejects.toThrowError(/not allowed to access route/i)
  })

  test('getBudget - un administrateur ne peut pas accéder au budget', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.administrator.budget.getBudget({ familyFileId })
    ).rejects.toThrowError(/user routes are not available to admins/i)
  })

  test("getBudget - un responsable de structure ne peut pas accéder au budget d'une autre structure", async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManager.budget.getBudget({
        familyFileId: familyFileIdAutreStructure
      })
    ).rejects.toThrow()
  })

  test("getBudget - un référent ne peut pas accéder au budget s'il n'est pas assigné au dossier", async ({
    trpc
  }) => {
    await expect(() =>
      trpc.referent.budget.getBudget({
        familyFileId: familyFileIdAutreStructure
      })
    ).rejects.toThrow()
  })

  test("getBudget - un référent peut pas accéder au budget s'il est assigné au dossier", async ({
    trpc
  }) => {
    const result = await trpc.referent.budget.getBudget({
      familyFileId: coursorFamilyFileId
    })
    expect(result).toBeDefined()
  })
})
