import { NotificationType } from '@prisma/client'
import dayjs from 'dayjs'
import { NotificationRepo } from '~/server/database'
import { getInactiveBeneficiariesWithOneMonthNotification } from './helper'
import { performance } from 'node:perf_hooks'

/** Reminder notifications for inactive beneficiaries :
 * - due to be archived in 7 days
 * - due to be archived today
 *
 * Only beneficiaries that have already received a 1-month notification
 * can receive a reminder */
export const createArchiveDueRemindersNotifications = async () => {
  const start = performance.now()

  const number = await handleCreation()

  const end = performance.now()
  const duration = (end - start) / 1000
  console.log(
    `createArchiveDueRemindersNotifications [${new Date()}]: notifications created: ${number} - time: ${duration}s`
  )
}

async function handleCreation() {
  // Filter all beneficiaries that must be archived in less than 7 days
  const mustBeArchivedBeneficiaries = (
    await getInactiveBeneficiariesWithOneMonthNotification()
  ).filter(b => dueDateInNDays(b.archiveDate, 7))

  const archiveNotifications = mustBeArchivedBeneficiaries
    .map(beneficiary => {
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

  return filteredNotifications.length
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
