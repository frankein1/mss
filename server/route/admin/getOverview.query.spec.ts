import { describe, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'

describe('Overview - Get Overview - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.getOverview()
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('Overview - Get Overview - Results', () => {
  test('Administrator can retrieve user and structure counts', async ({
    trpc
  }) => {
    const result = await trpc.administrator.admin.getOverview()

    expect(result).toBeDefined()
    expect(typeof result.users).toBe('number')
    expect(typeof result.structures).toBe('number')
    expect(result.users).toBeGreaterThan(0)
    expect(result.structures).toBeGreaterThan(0)
  })
})
