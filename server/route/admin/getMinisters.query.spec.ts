import { describe, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { fixturesMinisters } from '~~/prisma/fixtures'

const minister = fixturesMinisters[0]!

describe('Ministers - Get Ministers - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.getMinisters()
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('Ministers - Get Ministers - Results', () => {
  test('Administrator can retrieve ministers including seeded minister', async ({
    trpc
  }) => {
    const result = await trpc.administrator.admin.getMinisters()

    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)

    const seededMinister = result.find(m => m.id === minister.id)
    expect(seededMinister).toBeDefined()
    expect(seededMinister!.firstName).toBe(minister.firstName)
    expect(seededMinister!.lastName).toBe(minister.lastName)
  })
})
