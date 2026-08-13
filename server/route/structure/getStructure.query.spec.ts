import { describe, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { fixtureStructures, FixtureStructure } from '~~/prisma/fixtures'

describe('Structure - Get - Authorizations', () => {
  test('An Administrator is rejected by protectedProcedure', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.administrator.structure.getStructure()
    ).rejects.toThrow(/user routes are not available to admins/i)
  })
})

describe('Structure - Get - Data', () => {
  test('A SocialWorker can fetch their own structure', async ({ trpc }) => {
    const result = await trpc.socialWorker.structure.getStructure()
    expect(result.structure.id).toBe(
      fixtureStructures[FixtureStructure.Test].id
    )
    expect(result.structure.name).toBe(
      fixtureStructures[FixtureStructure.Test].name
    )
  })
})
