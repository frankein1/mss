import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { NotificationRepo } from '~/server/database'
import { fixturesUsers, FixtureUserRole } from '~/prisma/fixtures'
import { NotificationType } from '@prisma/client'
import { createArchiveDueOneMonthNotifications } from './create-archive-due-one-month-notifications.service'
import { test } from './__fixtures__'

beforeAll(async () => await test.createBeneficiary())

afterAll(async () => await test.deleteBeneficiary())

describe('Notification - Beneficiary Archive - Create notifications for archives due in one month', () => {
  let createdNotificationIds: string[] = []

  afterEach(
    async () =>
      await NotificationRepo.prisma.deleteMany({
        where: { id: { in: createdNotificationIds } }
      })
  )

  it('should create notifications for John Doe, Eric Duvers and Max Inactive', async () => {
    await createArchiveDueOneMonthNotifications()

    const notifs = await NotificationRepo.prisma.findMany({
      where: { type: NotificationType.ArchiveDueOneMonth }
    })
    createdNotificationIds = notifs.map(n => n.id)

    // See __fixtures__/index.ts for information on number of referents and expected archive date
    const johnDoeNotifs = notifs.filter(
      n => n.beneficiaryId === test.ID_JOHN_DOE
    )
    expect(johnDoeNotifs.length).toBe(1)
    expect(new Set(johnDoeNotifs.map(n => n.type))).toEqual(
      new Set([NotificationType.ArchiveDueOneMonth])
    )
    expect(new Set(johnDoeNotifs.map(n => n.recipientId))).toEqual(
      new Set([fixturesUsers[FixtureUserRole.StructureManager].id])
    )

    const ericDuversNotifs = notifs.filter(
      n => n.beneficiaryId === test.ID_ERIC_DUVERS
    )
    expect(ericDuversNotifs.length).toBe(1)
    expect(new Set(ericDuversNotifs.map(n => n.type))).toEqual(
      new Set([NotificationType.ArchiveDueOneMonth])
    )
    // Eric DUVERS has 3 referents but one of them is inactive
    expect(new Set(ericDuversNotifs.map(n => n.recipientId))).toEqual(
      new Set([fixturesUsers[FixtureUserRole.StructureManager].id])
    )

    const maxInactiveNotifs = notifs.filter(
      n => n.beneficiaryId === test.ID_INACTIVE
    )
    expect(maxInactiveNotifs.length).toBe(2)

    const sandraTessonNotifs = notifs.filter(
      n => n.beneficiaryId === test.ID_TESSON
    )
    expect(sandraTessonNotifs.length).toBe(1)
    expect(new Set(sandraTessonNotifs.map(n => n.type))).toEqual(
      new Set([NotificationType.ArchiveDueOneMonth])
    )
    // Sandra TESSON has 3 referents but one of them is inactive
    expect(new Set(sandraTessonNotifs.map(n => n.recipientId))).toEqual(
      new Set([fixturesUsers[FixtureUserRole.StructureManager].id])
    )

    expect(notifs.length).toEqual(5)
  })
})
