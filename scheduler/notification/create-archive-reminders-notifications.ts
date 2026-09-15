import { NotificationType } from '@prisma/client'
import dayjs from 'dayjs'
import { NotificationRepo } from '~~/server/database'
import { getInactiveBeneficiariesWithOneMonthNotification } from './helper'
import { withErrorCapture } from '../utils'

/** Reminder notifications for inactive beneficiaries :
 * - due to be archived in 7 days
 * - due to be archived today
 *
 * Only beneficiaries that have already received a 1-month notification
 * can receive a reminder */
async function createArchiveDueRemindersNotifications() {
  // Filter all beneficiaries that must be archived in less than 7 days
  const mustBeArchivedBeneficiaries = (
    await getInactiveBeneficiariesWithOneMonthNotification()
  ).filter(b => b && dueDateInNDays(b.archiveDate, 7))

  const archiveNotifications = mustBeArchivedBeneficiaries
    .map(beneficiary => {
      if (!beneficiary) {
        return []
      }
      return beneficiary.referentIds.flatMap(referentId => ({
        archiveDate: beneficiary.archiveDate,
        beneficiaryId: beneficiary.id,
        recipientId: referentId,
        // Create distinct notifications for archive in less than 1 day and archive in less than 7 days
        type: dueDateInNDays(beneficiary.archiveDate, 1)
          ? NotificationType.ArchiveDueToday
          : NotificationType.ArchiveDueSevenDays
      }))
    })
    .flat()

  const filteredNotifications =
    await compareAndFilterNotifications(archiveNotifications)
  await NotificationRepo.prisma.createMany({
    data: filteredNotifications
  })

  console.log(
    `createArchiveDueRemindersNotifications [${new Date().toISOString()}]: notifications created: ${filteredNotifications.length}`
  )
}

/** Select archive dates between now and now + N days */
function dueDateInNDays(archiveDate: Date, N: number) {
  const date = dayjs(archiveDate)
  const now = dayjs()
  return date.isAfter(now) && date.subtract(N, 'day').isBefore(now)
}

type ArchiveNotification = {
  archiveDate: Date
  beneficiaryId: string
  recipientId: string
  type: NotificationType
}

/** Filter out notifications that already exist for the same due date */
const compareAndFilterNotifications = async (
  notifications: ArchiveNotification[]
) => {
  const res = await NotificationRepo.prisma.findMany({
    where: {
      OR: [
        { type: NotificationType.ArchiveDueToday },
        { type: NotificationType.ArchiveDueSevenDays }
      ]
    }
  })
  const archiveNotificationsFromDb = res.map(notification => ({
    type: notification.type,
    beneficiaryId: notification.beneficiaryId,
    recipientId: notification.recipientId,
    archiveDate: notification.archiveDate
  })) as ArchiveNotification[]

  const filtered: ArchiveNotification[] = []

  notifications.forEach(notification => {
    const existing = archiveNotificationsFromDb.find(
      archiveNotification =>
        archiveNotification.beneficiaryId === notification.beneficiaryId &&
        archiveNotification.recipientId === notification.recipientId &&
        archiveNotification.archiveDate.getTime() ===
          notification.archiveDate.getTime()
    )
    if (!existing) {
      filtered.push(notification)
    }
  })
  return filtered
}

export default async function handler() {
  return await withErrorCapture(createArchiveDueRemindersNotifications)
}
