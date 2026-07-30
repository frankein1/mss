import { describe, expect, afterEach, beforeEach } from 'vitest'
import { test } from '~/test/server/test-utils'
import { prismaClient } from '~/server/prisma'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesSocialSupportSubjects
} from '~/prisma/fixtures'

const subjectIds: string[] = []
const originalNames = new Map<string, string>()

beforeEach(async () => {
  const subject = await prismaClient.socialSupportSubject.create({
    data: {
      name: 'USSS-Other Structure Subject',
      ownedByStructureId: fixtureStructures[FixtureStructure.Ministère].id
    }
  })
  subjectIds.push(subject.id)
})

afterEach(async () => {
  if (subjectIds.length) {
    await prismaClient.socialSupportSubject.deleteMany({
      where: { id: { in: subjectIds } }
    })
    subjectIds.length = 0
  }
  for (const [id, name] of originalNames) {
    await prismaClient.socialSupportSubject.update({
      where: { id },
      data: { name }
    })
  }
  originalNames.clear()
})

describe('Structure - Update Social Support Subject - Authorizations', () => {
  test('A StructureManager can rename a subject', async ({ trpc }) => {
    const subject = fixturesSocialSupportSubjects[0]!
    originalNames.set(subject.id, subject.name)
    const result =
      await trpc.structureManager.structure.updateSocialSupportSubject({
        id: subject.id,
        name: 'Renamed Subject'
      })
    expect(result.id).toBe(subject.id)

    await prismaClient.socialSupportSubject.update({
      where: { id: subject.id },
      data: { name: subject.name }
    })
    originalNames.delete(subject.id)
  })

  test('A SocialWorker cannot rename a subject', async ({ trpc }) => {
    await expect(() =>
      trpc.socialWorker.structure.updateSocialSupportSubject({
        id: fixturesSocialSupportSubjects[0]!.id,
        name: 'Should Fail'
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('A StructureManager cannot rename another structure subject', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManager.structure.updateSocialSupportSubject({
        id: subjectIds[0]!,
        name: 'Should Fail'
      })
    ).rejects.toThrow(
      /invalid(.*)prisma.socialSupportSubject[\s\S]*?no record/im
    )
  })
})
