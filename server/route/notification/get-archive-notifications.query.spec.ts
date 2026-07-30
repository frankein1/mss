import { describe, expect, afterEach, beforeEach } from 'vitest'
import { test } from '~/test/server/test-utils'
import { prismaClient } from '~/server/prisma'
import {
  fixturesUsers,
  FixtureUserRole,
  fixturesBeneficiaries,
  FixtureBeneficiary,
  fixtureStructures,
  FixtureStructure
} from '~/prisma/fixtures'

const notificationIds: string[] = []

beforeEach(async () => {
  const notification = await prismaClient.notification.create({
    data: {
      type: 'ArchiveDueOneMonth',
      recipientId: fixturesUsers[FixtureUserRole.Referent].id,
      beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.UNKNOWN].id,
      structureId: fixtureStructures[FixtureStructure.Test].id
    }
  })
  notificationIds.push(notification.id)
})

afterEach(async () => {
  if (notificationIds.length) {
    await prismaClient.notification.deleteMany({
      where: { id: { in: notificationIds } }
    })
    notificationIds.length = 0
  }
})

describe('Notification - Get Archive - Data', () => {
  test('A user sees only their own archive notifications', async ({ trpc }) => {
    const result = await trpc.referent.archiveNotification.get()
    expect(result.length).toBeGreaterThanOrEqual(1)

    const created = result.find(n => n.id === notificationIds[0])
    expect(created).toBeDefined()
    expect(created!.type).toBe('ArchiveDueOneMonth')
  })

  test('Another user does not see archive notifications of another user', async ({
    trpc
  }) => {
    const result = await trpc.socialWorker.archiveNotification.get()
    const found = result.find(n => n.id === notificationIds[0])
    expect(found).toBeUndefined()
  })
})
