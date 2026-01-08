import { test } from '~/test/server/test-utils'
import { fixturesUsers, FixtureUserRole } from '~/prisma/fixtures'
import { describe, expect } from 'vitest'

describe('Authorizations', () => {
  test('User - Update - Only a Structure Manager can update a user', async ({
    trpc
  }) => {
    const idUser = fixturesUsers[FixtureUserRole.StructureManager].id

    await expect(() =>
      trpc.socialWorker.user.update({
        id: idUser,
        firstName: fixturesUsers[FixtureUserRole.StructureManager].firstName,
        lastName: fixturesUsers[FixtureUserRole.StructureManager].lastName,
        email: fixturesUsers[FixtureUserRole.StructureManager].email,
        role: 'SocialWorker'
      })
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
        firstName: fixturesUsers[FixtureUserRole.StructureManager].firstName,
        lastName: fixturesUsers[FixtureUserRole.StructureManager].lastName,
        email: fixturesUsers[FixtureUserRole.StructureManager].email,
        role: 'StructureManager'
      })
    ).rejects.toThrowError(/invalid(.*)prisma.user.update[\s\S]*?no record/im)
  })

  test('User - Update - An agent cannot change a role to Administrator', async ({
    trpc
  }) => {
    const idUser = fixturesUsers[FixtureUserRole.SocialWorker].id

    await expect(() =>
      trpc.structureManager.user.update({
        id: idUser,
        firstName: fixturesUsers[FixtureUserRole.StructureManager].firstName,
        lastName: fixturesUsers[FixtureUserRole.StructureManager].lastName,
        email: fixturesUsers[FixtureUserRole.StructureManager].email,
        //@ts-expect-error Type administrator not assignable to role.
        role: 'Administrator'
      })
    ).rejects.toThrowError(/Administrator[\s\S]*?invalid_enum_value/i)
  })
})
