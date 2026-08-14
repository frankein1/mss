import { describe, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { fixtureStructures, FixtureStructure } from '~~/prisma/fixtures'

describe('Social Support Subjects - Get Social Support Subjects - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.getSocialSupportSubjects({
        id: fixtureStructures[FixtureStructure.Test].id
      })
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('Social Support Subjects - Get Social Support Subjects - Results', () => {
  test('Administrator can retrieve social support subjects for a structure', async ({
    trpc
  }) => {
    const result = await trpc.administrator.admin.getSocialSupportSubjects({
      id: fixtureStructures[FixtureStructure.Test].id
    })

    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })
})
