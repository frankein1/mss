import { test } from '~/test/server/test-utils'
import { fixturesUsers, FixtureUserRole } from '~/prisma/fixtures'
import { describe, expect } from 'vitest'

describe('Authorizations', () => {
  test('User - Update - Only a Structure Manager can update a user', async ({
    trpc
  }) => {
    const idUser = fixturesUsers[FixtureUserRole.StructureManager].id

    await expect(() =>
      trpc.socialWorker.user.update({ id: idUser, role: 'SocialWorker' })
    ).rejects.toThrowError(/not allowed to access route/i)
  })

  test('User - Update - A Structure Manager cannot update a user from another structure', async ({
    trpc
  }) => {
    const idUserOtherStructure =
      fixturesUsers[FixtureUserRole.SocialWorkerNew].id

    await expect(() =>
      trpc.structureManager.user.update({
        id: idUserOtherStructure,
        role: 'StructureManager'
      })
    ).rejects.toThrowError(/invalid(.*)prisma.user.update[\s\S]*?no record/im)
  })

  test('User - Update - An agent cannot change a role to Administrator', async ({
    trpc
  }) => {
    const idUser = fixturesUsers[FixtureUserRole.SocialWorker].id

    await expect(() =>
      trpc.structureManager.user.update({ id: idUser, role: 'Administrator' })
    ).rejects.toThrowError(/not allowed to access route/i)
  })
})
