import { NotificationType, Prisma } from '@prisma/client'
import { NotificationRepo } from '~/server/database'
import { prismaClient } from '~/server/prisma'
import { performance } from 'node:perf_hooks'
import { getInactiveBeneficiaries } from './helper'

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
  const mustBeArchivedBeneficiaries = await getInactiveBeneficiaries()

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

// Filter out notifications that already exist for the same due date
const compareAndFilterNotifications = async (
  notifications: ArchiveNotification[]
) => {
  if (notifications.length === 0) {
    return []
  }

  const res = (await prismaClient.$queryRaw`
    SELECT beneficiary_id, recipient_id, archive_date
    FROM notification
    WHERE type = ${NotificationType.ArchiveDueOneMonth}::text::"NotificationType"
    AND archive_date IS NOT NULL
    AND (beneficiary_id, recipient_id, archive_date) IN (
      SELECT *
      FROM UNNEST(
        ARRAY[${Prisma.join(notifications.map(n => n.beneficiaryId))}]::uuid[],
        ARRAY[${Prisma.join(notifications.map(n => n.recipientId))}]::uuid[],
        ARRAY[${Prisma.join(notifications.map(n => n.archiveDate))}]::timestamptz[]
      )
    )
  `) as { beneficiaryId: string; recipientId: string; archiveDate: Date }[]

  // Composite key for comparison
  const existingKeys = new Set(
    res.map(
      ({ beneficiaryId, recipientId, archiveDate }) =>
        `${beneficiaryId}|${recipientId}|${archiveDate?.getTime()}`
    )
  )
  const filtered = notifications.filter(
    ({ beneficiaryId, recipientId, archiveDate }) =>
      !existingKeys.has(
        `${beneficiaryId}|${recipientId}|${archiveDate.getTime()}`
      )
  )
  return filtered
}
