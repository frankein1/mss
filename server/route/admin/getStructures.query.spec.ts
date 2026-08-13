import { describe, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { fixtureStructures, FixtureStructure } from '~~/prisma/fixtures'

describe('Structures - Get Structures - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.getStructures()
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('Structures - Get Structures - Results', () => {
  test('Administrator can retrieve non-disabled structures', async ({
    trpc
  }) => {
    const result = await trpc.administrator.admin.getStructures()

    expect(result.structures).toBeDefined()
    expect(Array.isArray(result.structures)).toBe(true)
    expect(result.structures.length).toBeGreaterThan(0)

    const testStructure = result.structures.find(
      s => s.id === fixtureStructures[FixtureStructure.Test].id
    )
    expect(testStructure).toBeDefined()
    expect(testStructure!.disabled).toBe(false)
  })

  test('Administrator can search structures by name', async ({ trpc }) => {
    const result = await trpc.administrator.admin.getStructures({
      search: 'Autun'
    })

    expect(result.structures.length).toBeGreaterThan(0)

    const found = result.structures.find(
      s => s.id === fixtureStructures[FixtureStructure.Autun].id
    )
    expect(found).toBeDefined()
  })

  test('Administrator can search structures by zipcode', async ({ trpc }) => {
    const result = await trpc.administrator.admin.getStructures({
      search: '71400'
    })

    expect(result.structures.length).toBeGreaterThan(0)

    const found = result.structures.find(
      s => s.id === fixtureStructures[FixtureStructure.Autun].id
    )
    expect(found).toBeDefined()
  })
})
