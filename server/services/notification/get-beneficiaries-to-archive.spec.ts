/* eslint-disable no-console */
import { describe, it, beforeEach, afterEach, vi } from 'vitest'
import { prismaClient } from '~/server/prisma'
import { getInactiveBeneficiaries } from './helper'
import dayjs from 'dayjs'
import { NotificationType } from '@prisma/client'

// Ce test à pour but d'évaluer le nombre de bénéficiaire à archiver par structure
// SVP ne pas inclure dans la CI

describe.skip('Count inactive beneficiaries on production', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns inactive beneficiaries (some may already have received a notification)', async () => {
    // vi.setSystemTime(new Date('2025-12-31'))

    const mustBeArchivedBeneficiaries = (
      await getInactiveBeneficiaries()
    ).filter(b => dayjs(b.archiveDate).subtract(1, 'month').isBefore(dayjs()))

    console.log(
      `there are ${mustBeArchivedBeneficiaries.length} inactive beneficiaries in the database`
    )
  })

  it('calculates the number of beneficiaries that should receive a 1-month notification', async () => {
    const mustBeArchivedBeneficiaries = (
      await getInactiveBeneficiaries(true)
    ).filter(b => dayjs(b.archiveDate).subtract(1, 'month').isBefore(dayjs()))

    const filtered = await format(
      mustBeArchivedBeneficiaries,
      'ArchiveDueOneMonth'
    )

    const nBeneficiaries = new Set(filtered.map(f => f.beneficiaryId)).size

    console.log(
      `the planned job will send ${filtered.length} notifications of beneficiary file expiring in 1 month`
    )
    console.log(`this will concern ${nBeneficiaries} beneficiaries`)
  })
}, 1_000_000)

describe.skip('Nombre de bénéficiaires à archiver par structure', () => {
  it('should return nothing', async () => {
    const mustBeArchivedBeneficiaries = (
      await getInactiveBeneficiaries(true)
    ).filter(b => dayjs(b.archiveDate).subtract(1, 'month').isBefore(dayjs()))

    const structures = mustBeArchivedBeneficiaries
      .map(beneficiary => beneficiary.structure?.name || '')
      .filter(s => Boolean(s))

    const occurences = countOccurrences(structures)
    console.log(occurences)

    const structureLastActivity = await prismaClient.structure.findMany({
      where: {
        name: {
          in: Object.keys(occurences)
        }
      },
      select: {
        lastAccess: true,
        name: true
      }
    })

    const tableau = structureLastActivity.map(structure => {
      return {
        name: structure.name,
        lastAccess: structure.lastAccess?.toISOString()
          ? structure.lastAccess.toISOString()
          : null,
        nombreBeneficiaire: occurences[structure.name]
      }
    })

    console.log(tableau)
  })
}, 100000)

function countOccurrences(arr: string[]) {
  return arr.reduce((acc: Record<string, number>, val) => {
    acc[val] = (acc[val] || 0) + 1
    return acc
  }, {})
}

async function format(
  mustBeArchivedBeneficiaries: any[],
  type: NotificationType
) {
  const archiveNotifications = mustBeArchivedBeneficiaries
    .map(beneficiary => {
      return beneficiary.referentIds.flatMap((referentId: any) => ({
        archiveDate: beneficiary.archiveDate,
        beneficiaryId: beneficiary.id,
        recipientId: referentId,
        type,
        structureName: beneficiary.structure?.name || ''
      }))
    })
    .flat()

  const filteredNotifications =
    await compareAndFilterNotifications(archiveNotifications)

  return filteredNotifications
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
  const res = await prismaClient.notification.findMany({
    where: { type: 'ArchiveDueOneMonth' }
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
