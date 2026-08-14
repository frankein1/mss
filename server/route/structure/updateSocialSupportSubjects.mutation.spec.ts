import { describe, expect, afterEach } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { prismaClient } from '~~/server/prisma'
import { fixtureStructures, FixtureStructure } from '~~/prisma/fixtures'

afterEach(async () => {
  await prismaClient.socialSupportSubject.deleteMany({
    where: {
      name: { startsWith: 'USS-' },
      ownedByStructureId: fixtureStructures[FixtureStructure.Test].id
    }
  })
})

describe('Structure - Update Social Support Subjects - Authorizations', () => {
  test('A StructureManager can batch-add subjects', async ({ trpc }) => {
    const result =
      await trpc.structureManager.structure.updateSocialSupportSubjects({
        selected: [],
        customs: [{ name: 'USS-Custom Subject' }]
      })
    expect(result.id).toBeDefined()
  })

  test('A SocialWorker cannot batch-add subjects', async ({ trpc }) => {
    await expect(() =>
      trpc.socialWorker.structure.updateSocialSupportSubjects({
        selected: [],
        customs: [{ name: 'USS-Should Fail' }]
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })
})
