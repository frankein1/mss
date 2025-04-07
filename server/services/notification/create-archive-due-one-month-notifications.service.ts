import { NotificationType } from '@prisma/client'
import dayjs from 'dayjs'
import { NotificationRepo } from '~/server/database'
import { prismaClient } from '~/server/prisma'
import { getInactiveBeneficiaries } from './helper'
import { performance } from 'node:perf_hooks'

/** Notifications for inactive beneficiaries due to be archived in 1 month */
export const createArchiveDueOneMonthNotifications = async () => {
  const start = performance.now()

  const number = await handleCreation()

  const end = performance.now()
  const duration = (end - start) / 1000
  console.log(
    `createArchiveDueOneMonthNotifications [${new Date()}]: notifications created: ${number} - time: ${duration}s`
  )
}

async function handleCreation() {
  const mustBeArchivedBeneficiaries = (await getInactiveBeneficiaries()).filter(
    b => dayjs(b.archiveDate).subtract(1, 'month').isBefore(dayjs())
  )

  const archiveNotifications = mustBeArchivedBeneficiaries
    .map(beneficiary => {
      return beneficiary.referentIds.flatMap(referentId => ({
        archiveDate: beneficiary.archiveDate,
        beneficiaryId: beneficiary.id,
        recipientId: referentId,
        type: NotificationType.ArchiveDueOneMonth
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

type ArchiveNotification = {
  archiveDate: Date
  beneficiaryId: string
  recipientId: string
  type: NotificationType
}

// FIXME use db request to get previous notifications
/** Filter out notifications that already exist for the same due date */
const compareAndFilterNotifications = async (
  notifications: ArchiveNotification[]
) => {
  const res = await prismaClient.notification.findMany({
    where: { type: NotificationType.ArchiveDueOneMonth }
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
