import { describe, expect, afterEach, beforeEach } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { prismaClient } from '~~/server/prisma'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~~/prisma/fixtures'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import dayjs from 'dayjs'
import { UserStatus } from '@prisma/client'

mockNuxtImport('useRuntimeConfig', () => {
  return () => ({
    app: { baseURL: '/' },
    public: { email: { from: 'mss@example.com' } },
    document: { useS3Storage: true }
  })
})

const sourceStructureId = fixtureStructures[FixtureStructure.Test].id
const targetStructureId = fixtureStructures[FixtureStructure.Autun].id
const adminUserId = fixturesUsers[FixtureUserRole.Administrator].id

let transferableUserId: string
let secondaryManagerId: string
const emailFromPrefixes = [
  'transfer-spec-user-',
  'transfer-spec-manager-',
  'transfer-spec-target-manager-'
]
const createdFamilyFileIds: string[] = []
const createdNotificationIds: string[] = []
const createdEmailIds: string[] = []

async function primeConfirmationCode(code: string) {
  await prismaClient.user.update({
    where: { id: adminUserId },
    data: {
      authorizationCode: code,
      authorizationCodeValidity: dayjs().add(10, 'minutes').toDate()
    }
  })
}

async function clearAdminCode() {
  await prismaClient.user.update({
    where: { id: adminUserId },
    data: { authorizationCode: null, authorizationCodeValidity: null }
  })
}

beforeEach(async () => {
  // A dedicated StructureManager we can safely transfer without breaking the source structure.
  const user = await prismaClient.user.create({
    data: {
      email: `transfer-spec-user-${Date.now()}@test.com`,
      firstName: 'Move',
      lastName: 'Me',
      role: 'SocialWorker',
      status: 'Active',
      structureId: sourceStructureId
    }
  })
  transferableUserId = user.id

  // Also guarantee the target structure has a StructureManager for the manager email
  // — Autun already does via fixtures, but we add a second one anyway.
  const secondaryManager = await prismaClient.user.create({
    data: {
      email: `transfer-spec-target-manager-${Date.now()}@test.com`,
      firstName: 'Target',
      lastName: 'Manager',
      role: 'StructureManager',
      status: 'Active',
      structureId: targetStructureId
    }
  })
  secondaryManagerId = secondaryManager.id

  await primeConfirmationCode('111111111111')
})

afterEach(async () => {
  await clearAdminCode()

  if (createdFamilyFileIds.length) {
    await prismaClient.familyFile.deleteMany({
      where: { id: { in: createdFamilyFileIds } }
    })
    createdFamilyFileIds.length = 0
  }
  if (createdNotificationIds.length) {
    await prismaClient.notification.deleteMany({
      where: { id: { in: createdNotificationIds } }
    })
    createdNotificationIds.length = 0
  }
  if (createdEmailIds.length) {
    await prismaClient.email.deleteMany({
      where: { id: { in: createdEmailIds } }
    })
    createdEmailIds.length = 0
  }

  await prismaClient.user.deleteMany({
    where: { id: { in: [transferableUserId, secondaryManagerId] } }
  })

  await prismaClient.userActivity.deleteMany({
    where: { key: 'admin.user.transfer' }
  })
  await prismaClient.email.deleteMany({
    where: {
      OR: emailFromPrefixes.map(prefix => ({ to: { startsWith: prefix } }))
    }
  })
})

describe('Admin - Transfer User - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.transferUser({
        userId: transferableUserId,
        newStructureId: targetStructureId,
        newRole: 'SocialWorker',
        confirmationCode: '111111111111'
      })
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('Admin - Transfer User - Happy path', () => {
  test('An administrator can transfer a user to another structure', async ({
    trpc
  }) => {
    const result = await trpc.administrator.admin.transferUser({
      userId: transferableUserId,
      newStructureId: targetStructureId,
      newRole: 'Referent',
      confirmationCode: '111111111111'
    })

    expect(result).toMatchObject({
      id: transferableUserId,
      structureId: targetStructureId,
      role: 'Referent',
      fromStructureId: sourceStructureId,
      toStructureId: targetStructureId,
      fromRole: 'SocialWorker',
      toRole: 'Referent'
    })

    const persisted = await prismaClient.user.findUniqueOrThrow({
      where: { id: transferableUserId }
    })
    expect(persisted.structureId).toBe(targetStructureId)
    expect(persisted.role).toBe('Referent')

    const activity = await prismaClient.userActivity.findFirst({
      where: {
        key: 'admin.user.transfer',
        objectId: transferableUserId
      }
    })
    expect(activity).not.toBeNull()

    const targetManagerEmails = await prismaClient.email.findMany({
      where: {
        subject: { contains: 'Un nouvel utilisateur a rejoint votre structure' }
      }
    })
    expect(targetManagerEmails.length).toBeGreaterThanOrEqual(1)
  })
})

describe('Admin - Transfer User - Notification cleanup', () => {
  test('Notifications outside the new structure are removed', async ({
    trpc
  }) => {
    const [oldStructureNotif, targetStructureNotif, orphanNotif] =
      await Promise.all([
        prismaClient.notification.create({
          data: {
            recipientId: transferableUserId,
            type: 'NewComment',
            structureId: sourceStructureId
          }
        }),
        prismaClient.notification.create({
          data: {
            recipientId: transferableUserId,
            type: 'NewComment',
            structureId: targetStructureId
          }
        }),
        prismaClient.notification.create({
          data: {
            recipientId: transferableUserId,
            type: 'NewComment'
          }
        })
      ])
    createdNotificationIds.push(
      oldStructureNotif.id,
      targetStructureNotif.id,
      orphanNotif.id
    )

    await trpc.administrator.admin.transferUser({
      userId: transferableUserId,
      newStructureId: targetStructureId,
      newRole: 'SocialWorker',
      confirmationCode: '111111111111'
    })

    const remaining = await prismaClient.notification.findMany({
      where: { id: { in: createdNotificationIds } },
      select: { id: true }
    })
    expect(remaining.map(r => r.id)).toEqual([targetStructureNotif.id])
  })
})

describe('Admin - Transfer User - Referent guardrail', () => {
  test('Transfer refused when user is still referent on family files', async ({
    trpc
  }) => {
    const familyFile = await prismaClient.familyFile.create({
      data: {
        structureId: sourceStructureId,
        referents: { connect: [{ id: transferableUserId }] }
      }
    })
    createdFamilyFileIds.push(familyFile.id)

    await expect(() =>
      trpc.administrator.admin.transferUser({
        userId: transferableUserId,
        newStructureId: targetStructureId,
        newRole: 'Referent',
        confirmationCode: '111111111111'
      })
    ).rejects.toThrow(/still referent on 1 family file/i)

    const stillOnSource = await prismaClient.user.findUniqueOrThrow({
      where: { id: transferableUserId }
    })
    expect(stillOnSource.structureId).toBe(sourceStructureId)
  })
})

describe('Admin - Transfer User - Refusals', () => {
  test('An administrator cannot be transferred', async ({ trpc }) => {
    await expect(() =>
      trpc.administrator.admin.transferUser({
        userId: fixturesUsers[FixtureUserRole.Administrator].id,
        newStructureId: targetStructureId,
        newRole: 'SocialWorker',
        confirmationCode: '111111111111'
      })
    ).rejects.toThrow(/cannot transfer an administrator/i)
  })

  test('Transfer refused when target structure equals current', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.administrator.admin.transferUser({
        userId: transferableUserId,
        newStructureId: sourceStructureId,
        newRole: 'SocialWorker',
        confirmationCode: '111111111111'
      })
    ).rejects.toThrow(/user already belongs to structure/i)
  })

  test('Transfer refused when target structure is disabled', async ({
    trpc
  }) => {
    const disabledStructure = await prismaClient.structure.create({
      data: {
        name: 'Disabled Transfer Target',
        type: 'Ccas',
        disabled: true,
        address: '1 rue Disabled',
        city: 'Disabled',
        zipcode: '00000',
        phone: '01 00 00 00 00',
        email: 'disabled-transfer-target@test.com'
      }
    })
    try {
      await expect(() =>
        trpc.administrator.admin.transferUser({
          userId: transferableUserId,
          newStructureId: disabledStructure.id,
          newRole: 'SocialWorker',
          confirmationCode: '111111111111'
        })
      ).rejects.toThrow(/cannot transfer a user to a disabled structure/i)
    } finally {
      await prismaClient.structure.delete({
        where: { id: disabledStructure.id }
      })
    }
  })

  test('Transfer refused when user is disabled', async ({ trpc }) => {
    await prismaClient.user.update({
      where: { id: transferableUserId },
      data: { status: UserStatus.Disabled }
    })
    await expect(() =>
      trpc.administrator.admin.transferUser({
        userId: transferableUserId,
        newStructureId: targetStructureId,
        newRole: 'SocialWorker',
        confirmationCode: '111111111111'
      })
    ).rejects.toThrow(/cannot transfer a disabled user/i)
  })

  test('Transfer refused when source structure would lose its only StructureManager', async ({
    trpc
  }) => {
    // Seed a fresh isolated structure with a single StructureManager, then
    // try to transfer that manager away.
    const soloStructure = await prismaClient.structure.create({
      data: {
        name: 'Solo Structure Transfer',
        type: 'Ccas',
        address: '1 rue Solo',
        city: 'Solo',
        zipcode: '00001',
        phone: '01 00 00 00 00',
        email: 'transfer-spec-solo@test.com'
      }
    })
    const soloManager = await prismaClient.user.create({
      data: {
        email: `transfer-spec-manager-${Date.now()}@test.com`,
        firstName: 'Solo',
        lastName: 'Manager',
        role: 'StructureManager',
        status: 'Active',
        structureId: soloStructure.id
      }
    })
    try {
      await expect(() =>
        trpc.administrator.admin.transferUser({
          userId: soloManager.id,
          newStructureId: targetStructureId,
          newRole: 'StructureManager',
          confirmationCode: '111111111111'
        })
      ).rejects.toThrow(/last structure manager/i)
    } finally {
      await prismaClient.user.delete({ where: { id: soloManager.id } })
      await prismaClient.structure.delete({ where: { id: soloStructure.id } })
    }
  })
})

describe('Admin - Transfer User - Confirmation code', () => {
  test('Transfer fails with a wrong code', async ({ trpc }) => {
    await expect(() =>
      trpc.administrator.admin.transferUser({
        userId: transferableUserId,
        newStructureId: targetStructureId,
        newRole: 'SocialWorker',
        confirmationCode: '99999999'
      })
    ).rejects.toThrow(/invalid code/i)

    const stillOnSource = await prismaClient.user.findUniqueOrThrow({
      where: { id: transferableUserId }
    })
    expect(stillOnSource.structureId).toBe(sourceStructureId)
  })

  test('Transfer fails with an expired code', async ({ trpc }) => {
    await prismaClient.user.update({
      where: { id: adminUserId },
      data: {
        authorizationCode: '11111111',
        authorizationCodeValidity: dayjs().subtract(1, 'minutes').toDate()
      }
    })

    await expect(() =>
      trpc.administrator.admin.transferUser({
        userId: transferableUserId,
        newStructureId: targetStructureId,
        newRole: 'SocialWorker',
        confirmationCode: '111111111111'
      })
    ).rejects.toThrow(/invalid code/i)
  })
})

describe('Admin - Transfer User - Degenerate case', () => {
  test('Transfer succeeds when the user has no notifications and no referent memberships', async ({
    trpc
  }) => {
    const result = await trpc.administrator.admin.transferUser({
      userId: transferableUserId,
      newStructureId: targetStructureId,
      newRole: 'SocialWorker',
      confirmationCode: '111111111111'
    })
    expect(result.structureId).toBe(targetStructureId)
  })
})
