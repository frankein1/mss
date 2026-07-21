import { prismaClient } from '~/server/prisma'
import { test } from '~/test/server/test-utils'
import { fixturesUsers, FixtureUserRole } from '~/prisma/fixtures'
import { describe, expect, afterAll } from 'vitest'
import { fakerFR as faker } from '@faker-js/faker'

const randomUser = () => ({
  firstName: faker.person.firstName(),
  lastName: 'ABCDEFGH',
  email: faker.internet.email()
})

const USERS = [randomUser(), randomUser(), randomUser()] as const

afterAll(
  async () =>
    await prismaClient.user.deleteMany({ where: { lastName: 'ABCDEFGH' } })
)

describe('Authorizations', () => {
  test('User - Create - Only a Structure Manager can create a user', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.socialWorker.user.add({
        ...USERS[0],
        role: 'SocialWorker'
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('User - Create - The created user belongs to the same structure as the Structure manager', async ({
    trpc
  }) => {
    const res = await trpc.structureManager.user.add({
      ...USERS[1],
      role: 'StructureManager'
    })

    const user = await prismaClient.user.findUniqueOrThrow({
      where: { id: res.id },
      select: { structureId: true }
    })
    expect(user.structureId).toBe(
      fixturesUsers[FixtureUserRole.StructureManager].structureId
    )
  })

  test('User - Create - An structure manager cannot create an Administrator', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManager.user.add({
        ...USERS[2],
        //@ts-expect-error Type administrator not assignable to role.
        role: 'Administrator'
      })
    ).rejects.toThrow(/Administrator[\s\S]*?invalid_enum_value/i)
  })
})
