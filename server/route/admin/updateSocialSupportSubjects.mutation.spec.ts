import { describe, expect, afterEach } from 'vitest'
import { NotificationType } from '@prisma/client'
import { test } from '~~/test/server/test-utils'
import { prismaClient } from '~~/server/prisma'
import { fixtureStructures, FixtureStructure } from '~~/prisma/fixtures'

const structureId = fixtureStructures[FixtureStructure.Test].id

afterEach(async () => {
  await prismaClient.socialSupportSubject.deleteMany({
    where: {
      name: { startsWith: 'AUASS-' },
      ownedByStructureId: structureId
    }
  })

  await prismaClient.notification.deleteMany({
    where: {
      type: NotificationType.NewSocialSupportSubject,
      detail: { startsWith: 'AUASS-' }
    }
  })
})

describe('Admin - Update Social Support Subjects - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.updateSocialSupportSubjects({
        structureId,
        selected: [],
        customs: [{ name: 'AUASS-Should Fail' }]
      })
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('Admin - Update Social Support Subjects - Happy path', () => {
  test('An administrator can batch-add subjects to a structure', async ({
    trpc
  }) => {
    const result = await trpc.administrator.admin.updateSocialSupportSubjects({
      structureId,
      selected: [],
      customs: [
        { name: 'AUASS-Custom Subject One' },
        { name: 'AUASS-Custom Subject Two' }
      ]
    })

    expect(result.id).toBeDefined()

    const subjects = await prismaClient.socialSupportSubject.findMany({
      where: {
        name: { startsWith: 'AUASS-' },
        ownedByStructureId: structureId
      }
    })
    expect(subjects).toHaveLength(2)
    expect(subjects.map(s => s.name).sort()).toEqual([
      'AUASS-Custom Subject One',
      'AUASS-Custom Subject Two'
    ])
  })
})
