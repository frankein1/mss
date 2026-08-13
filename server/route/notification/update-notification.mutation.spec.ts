import { afterEach, describe, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { prismaClient } from '~~/server/prisma'
import { fixturesNotifications, FixtureNotification } from '~~/prisma/fixtures'

const notificationId =
  fixturesNotifications[FixtureNotification.ReferentNewComment].id

describe('Notification - Update - Authorizations', () => {
  afterEach(async () => {
    await prismaClient.notification.update({
      where: { id: notificationId },
      data: { read: false }
    })
  })

  test('A user can mark their own notification as read', async ({ trpc }) => {
    await trpc.referent.notification.update({
      id: notificationId,
      read: true
    })

    const notification = await prismaClient.notification.findUniqueOrThrow({
      where: { id: notificationId }
    })
    expect(notification.read).toBe(true)
  })

  test('A user cannot mark another user notification as read', async ({
    trpc
  }) => {
    await trpc.socialWorker.notification.update({
      id: notificationId,
      read: true
    })

    const notification = await prismaClient.notification.findUniqueOrThrow({
      where: { id: notificationId }
    })
    expect(notification.read).toBe(false)
  })
})
