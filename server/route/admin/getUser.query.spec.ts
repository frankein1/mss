import { describe, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { fixturesUsers, FixtureUserRole } from '~~/prisma/fixtures'

describe('User - Get User - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.getUser({
        id: fixturesUsers[FixtureUserRole.StructureManager].id
      })
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('User - Get User - Results', () => {
  test('Administrator can retrieve a non-admin user by ID', async ({
    trpc
  }) => {
    const referent = fixturesUsers[FixtureUserRole.Referent]

    const result = await trpc.administrator.admin.getUser({
      id: referent.id
    })

    expect(result).toBeDefined()
    expect(result.id).toBe(referent.id)
  })

  test('Administrator cannot fetch an Administrator user', async ({ trpc }) => {
    const admin = fixturesUsers[FixtureUserRole.Administrator]

    await expect(() =>
      trpc.administrator.admin.getUser({ id: admin.id })
    ).rejects.toThrow(/no.*record/i)
  })
})
