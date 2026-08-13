import { describe, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { fixturesMinisters } from '~~/prisma/fixtures'

const minister = fixturesMinisters[0]!

describe('Minister - Get Minister - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.getMinister({
        id: minister.id
      })
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('Minister - Get Minister - Results', () => {
  test('Administrator can retrieve a seeded minister by ID', async ({
    trpc
  }) => {
    const result = await trpc.administrator.admin.getMinister({
      id: minister.id
    })

    expect(result).toBeDefined()
    expect(result!.id).toBe(minister.id)
    expect(result!.firstName).toBe(minister.firstName)
    expect(result!.lastName).toBe(minister.lastName)
    expect(result!.function).toBe(minister.function)
    expect(result!.government).toBe(minister.government)
    expect(result!.status).toBe(minister.status)
  })
})
