import { describe, it, expect, afterEach } from 'vitest'
import dayjs from 'dayjs'
import { NotificationType } from '@prisma/client'
import { NotificationRepo } from '~~/server/database'
import { fixturesUsers } from '~~/prisma/fixtures'
import { cleanupReadNotifications } from './cleanup-read-notifications'

const recipientId = fixturesUsers[0].id

const createNotification = (type: NotificationType, readAt: Date | null) =>
  NotificationRepo.prisma.create({
    data: { type, recipientId, read: readAt !== null, readAt }
  })

describe('Notification - Cleanup read notifications', () => {
  let createdNotificationIds: string[] = []

  afterEach(async () => {
    await NotificationRepo.prisma.deleteMany({
      where: { id: { in: createdNotificationIds } }
    })
    createdNotificationIds = []
  })

  it('should delete only notifications read more than 1 month ago, except archive ones', async () => {
    const twoMonthsAgo = dayjs().subtract(2, 'months').toDate()
    const twoWeeksAgo = dayjs().subtract(2, 'weeks').toDate()

    const readLongAgo = await createNotification(
      NotificationType.NewComment,
      twoMonthsAgo
    )
    const readRecently = await createNotification(
      NotificationType.NewComment,
      twoWeeksAgo
    )
    const unread = await createNotification(NotificationType.NewComment, null)
    const archiveReadLongAgo = await createNotification(
      NotificationType.ArchiveDueOneMonth,
      twoMonthsAgo
    )
    createdNotificationIds = [
      readLongAgo.id,
      readRecently.id,
      unread.id,
      archiveReadLongAgo.id
    ]

    await cleanupReadNotifications()

    const remaining = await NotificationRepo.prisma.findMany({
      where: { id: { in: createdNotificationIds } },
      select: { id: true }
    })
    expect(new Set(remaining.map(n => n.id))).toEqual(
      new Set([readRecently.id, unread.id, archiveReadLongAgo.id])
    )
  })
})
