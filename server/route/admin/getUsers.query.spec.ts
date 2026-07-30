import { describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import { fixturesUsers, FixtureUserRole } from '~/prisma/fixtures'

describe('Users - Get Users - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.getUsers({})
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('Users - Get Users - Results', () => {
  test('Administrator can retrieve non-admin users from non-disabled structures', async ({
    trpc
  }) => {
    const result = await trpc.administrator.admin.getUsers({})

    expect(result.users).toBeDefined()
    expect(Array.isArray(result.users)).toBe(true)
    expect(result.users.length).toBeGreaterThan(0)

    result.users.forEach(user => {
      expect(user.role).not.toBe('Administrator')
    })
  })

  test('Administrator can search users by name or email', async ({ trpc }) => {
    const referent = fixturesUsers[FixtureUserRole.Referent]

    const result = await trpc.administrator.admin.getUsers({
      search: referent.lastName
    })

    expect(result.users.length).toBeGreaterThan(0)

    const found = result.users.find(u => u.id === referent.id)
    expect(found).toBeDefined()
  })

  test('Administrator can filter users by role', async ({ trpc }) => {
    const result = await trpc.administrator.admin.getUsers({
      filters: { role: 'StructureManager' }
    })

    expect(result.users.length).toBeGreaterThan(0)

    result.users.forEach(user => {
      expect(user.role).toBe('StructureManager')
    })
  })
})
