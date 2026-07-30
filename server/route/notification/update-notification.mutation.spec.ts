import { describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import { prismaClient } from '~/server/prisma'

describe('Notification - Update - Authorizations', () => {
  test('A user can mark their own notification as read', async ({ trpc }) => {
    const notificationId = '3a39f0ae-17c0-4616-9e76-523faad59cfc'
    await trpc.referent.notification.update({
      id: notificationId,
      read: true
    })

    const notification = await prismaClient.notification.findUniqueOrThrow({
      where: { id: notificationId }
    })
    expect(notification.read).toBe(true)

    await prismaClient.notification.update({
      where: { id: notificationId },
      data: { read: false }
    })
  })

  test('A user cannot mark another user notification as read', async ({
    trpc
  }) => {
    const notificationId = '3a39f0ae-17c0-4616-9e76-523faad59cfc'
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
