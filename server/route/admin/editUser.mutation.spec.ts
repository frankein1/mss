import { describe, expect, afterEach, beforeEach } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { prismaClient } from '~~/server/prisma'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~~/prisma/fixtures'

const structureId = fixtureStructures[FixtureStructure.Test].id
const seededUser = fixturesUsers[FixtureUserRole.SocialWorker]

describe('Admin - Edit User - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.editUser({
        id: seededUser.id,
        firstName: seededUser.firstName,
        lastName: seededUser.lastName,
        email: seededUser.email,
        role: 'SocialWorker',
        status: 'Active',
        structureId
      })
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('Admin - Edit User - Happy path', () => {
  afterEach(async () => {
    await prismaClient.user.update({
      where: { id: seededUser.id },
      data: {
        firstName: seededUser.firstName,
        lastName: seededUser.lastName,
        email: seededUser.email
      }
    })
  })

  test('An administrator can update user fields', async ({ trpc }) => {
    const result = await trpc.administrator.admin.editUser({
      id: seededUser.id,
      firstName: 'Updated',
      lastName: 'Name',
      email: seededUser.email,
      role: 'SocialWorker',
      status: 'Active',
      structureId
    })

    expect(result.id).toBe(seededUser.id)

    const user = await prismaClient.user.findUniqueOrThrow({
      where: { id: seededUser.id }
    })
    expect(user.firstName).toBe('Updated')
    expect(user.lastName).toBe('Name')
  })
})

describe('Admin - Edit User - Reject editing an Administrator', () => {
  test('An administrator cannot edit another administrator', async ({
    trpc
  }) => {
    const adminUser = fixturesUsers[FixtureUserRole.Administrator]

    await expect(() =>
      trpc.administrator.admin.editUser({
        id: adminUser.id,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        email: adminUser.email,
        role: 'SocialWorker',
        status: 'Active',
        structureId
      })
    ).rejects.toThrow(/cannot edit an administrator/i)
  })
})

describe('Admin - Edit User - Reject changing the structureId', () => {
  const otherStructureId = fixtureStructures[FixtureStructure.Autun].id

  test('An administrator cannot change a user structure via the edit form', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.administrator.admin.editUser({
        id: seededUser.id,
        firstName: seededUser.firstName,
        lastName: seededUser.lastName,
        email: seededUser.email,
        role: 'SocialWorker',
        status: 'Active',
        structureId: otherStructureId
      })
    ).rejects.toThrow(/cannot change the structure/i)
  })
})

describe('Admin - Edit User - Reject editing a user in a disabled structure', () => {
  let disabledStructureId: string
  let disabledUserId: string

  beforeEach(async () => {
    const structure = await prismaClient.structure.create({
      data: {
        name: 'Disabled Structure',
        type: 'Ccas',
        disabled: true,
        address: '1 rue Disabled',
        city: 'Disabled City',
        zipcode: '00000',
        phone: '01 00 00 00 00',
        email: 'disabled-structure-spec@test.com'
      }
    })
    disabledStructureId = structure.id

    const user = await prismaClient.user.create({
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'disabled-test@test.com',
        role: 'SocialWorker',
        status: 'Active',
        structureId: structure.id
      }
    })
    disabledUserId = user.id
  })

  afterEach(async () => {
    await prismaClient.user.deleteMany({
      where: { structureId: disabledStructureId }
    })
    await prismaClient.structure.delete({
      where: { id: disabledStructureId }
    })
  })

  test('An administrator cannot edit a user in a disabled structure', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.administrator.admin.editUser({
        id: disabledUserId,
        firstName: 'Should',
        lastName: 'Fail',
        email: 'disabled-test@test.com',
        role: 'SocialWorker',
        status: 'Active',
        structureId: disabledStructureId
      })
    ).rejects.toThrow(/cannot edit a user in a disabled structure/i)
  })
})
