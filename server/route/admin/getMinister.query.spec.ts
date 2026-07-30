import { describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import { fixturesMinisters } from '~/prisma/fixtures'

describe('Minister - Get Minister - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.getMinister({
        id: fixturesMinisters[0].id
      })
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('Minister - Get Minister - Results', () => {
  test('Administrator can retrieve a seeded minister by ID', async ({
    trpc
  }) => {
    const result = await trpc.administrator.admin.getMinister({
      id: fixturesMinisters[0].id
    })

    expect(result).toBeDefined()
    expect(result!.id).toBe(fixturesMinisters[0].id)
    expect(result!.firstName).toBe(fixturesMinisters[0].firstName)
    expect(result!.lastName).toBe(fixturesMinisters[0].lastName)
    expect(result!.function).toBe(fixturesMinisters[0].function)
    expect(result!.government).toBe(fixturesMinisters[0].government)
    expect(result!.status).toBe(fixturesMinisters[0].status)
  })
})
