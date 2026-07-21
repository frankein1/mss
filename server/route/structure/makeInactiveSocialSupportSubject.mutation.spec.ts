import { test } from '~/test/server/test-utils'
import {
  fixturesSocialSupportSubjects,
  fixtureStructures
} from '~/prisma/fixtures'
import { describe, expect, beforeEach, afterEach } from 'vitest'
import { prismaClient } from '~/server/prisma'

const subjectIds: string[] = []

describe('Authorizations', () => {
  beforeEach(async () => {
    const { id } = await prismaClient.socialSupportSubject.create({
      select: { id: true },
      data: {
        name: 'test',
        ownedByStructureId: fixtureStructures[2].id
      }
    })
    subjectIds.push(id)
  })

  afterEach(resetDatabase)

  test('Structure - Make subject Inactive - Only a Structure Manager can update subject', async ({
    trpc
  }) => {
    const id = fixturesSocialSupportSubjects[0].id

    await expect(() =>
      trpc.socialWorker.structure.makeInactiveSocialSupportSubject({ id })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('Structure - Make subject Inactive - A Structure Manager cannot update a subject from another structure', async ({
    trpc
  }) => {
    await expect(
      () =>
        subjectIds[0] &&
        trpc.structureManager.structure.makeInactiveSocialSupportSubject({
          id: subjectIds[0]
        })
    ).rejects.toThrow(
      /invalid(.*)prisma.socialSupportSubject[\s\S]*?no record/im
    )
  })
})

async function resetDatabase() {
  await prismaClient.socialSupportSubject.deleteMany({
    where: { id: { in: subjectIds } }
  })
}
