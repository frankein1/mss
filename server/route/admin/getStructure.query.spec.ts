import { describe, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { fixtureStructures, FixtureStructure } from '~~/prisma/fixtures'

describe('Structure - Get Structure - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.getStructure({
        id: fixtureStructures[FixtureStructure.Test].id
      })
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('Structure - Get Structure - Results', () => {
  test('Administrator can retrieve a structure with users and social support subjects', async ({
    trpc
  }) => {
    const result = await trpc.administrator.admin.getStructure({
      id: fixtureStructures[FixtureStructure.Test].id
    })

    expect(result.structure).toBeDefined()
    expect(result.structure.id).toBe(
      fixtureStructures[FixtureStructure.Test].id
    )

    expect(result.users).toBeDefined()
    expect(Array.isArray(result.users)).toBe(true)
    expect(result.users.length).toBeGreaterThan(0)

    expect(result.socialSupportSubjects).toBeDefined()
    expect(Array.isArray(result.socialSupportSubjects)).toBe(true)
    expect(result.socialSupportSubjects.length).toBeGreaterThan(0)

    result.socialSupportSubjects.forEach(subject => {
      expect(subject.inactive).toBe(false)
    })
  })
})
