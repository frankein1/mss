import dayjs from 'dayjs'
import { NotificationType } from '@prisma/client'
import { NotificationRepo } from '~~/server/database'
import { withErrorCapture } from '../utils'

// Archive notifications are used as state by the archive jobs, they must be kept
const ARCHIVE_NOTIFICATION_TYPES = [
  NotificationType.ArchiveDueOneMonth,
  NotificationType.ArchiveDueSevenDays,
  NotificationType.ArchiveDueToday
]

export async function cleanupReadNotifications() {
  const res = await NotificationRepo.prisma.deleteMany({
    where: {
      // Read more than 1 month ago
      readAt: { lte: dayjs().subtract(1, 'month').toDate() },
      type: { notIn: ARCHIVE_NOTIFICATION_TYPES }
    }
  })
  console.log(
    `cleanup-read-notifications: [${new Date().toISOString()}]: ${res.count} deleted`
  )
}

/** Notifications read more than 1 month ago are deleted, except archive ones */
export default async function handler() {
  return await withErrorCapture(cleanupReadNotifications)
}
