import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { NotificationRepo } from '~~/server/database'
import { fixturesUsers, FixtureUserRole } from '~~/prisma/fixtures'
import { NotificationType } from '@prisma/client'
import { test } from './__fixtures__'
import createArchiveDueRemindersNotifications from './create-archive-reminders-notifications'
import createArchiveDueOneMonthNotifications from './create-archive-due-one-month-notifications'

beforeAll(async () => await test.createBeneficiary())

afterAll(async () => await test.deleteBeneficiary())

describe('Notification - Beneficiary Archive - Create reminder notifications', () => {
  afterEach(async () => {
    await NotificationRepo.prisma.deleteMany({
      where: {
        beneficiaryId: {
          in: [
            test.ID_JOHN_DOE,
            test.ID_JANE,
            test.ID_GRECO,
            test.ID_DOC,
            test.ID_TONY_MARTIN,
            test.ID_TANIA_ANDRE,
            test.ID_ERIC_DUVERS,
            test.ID_TESSON,
            test.ID_INACTIVE
          ]
        }
      }
    })
  })

  it('should create reminder notifications for Sandra Tesson, John Doe, Eric Duvers and Max Inactive', async () => {
    await createArchiveDueOneMonthNotifications()
    await createArchiveDueRemindersNotifications()

    const reminderNotifications = await NotificationRepo.prisma.findMany({
      where: {
        type: {
          in: [
            NotificationType.ArchiveDueToday,
            NotificationType.ArchiveDueSevenDays
          ]
        }
      }
    })

    const sandraTessonNotifs = reminderNotifications.filter(
      n => n.beneficiaryId === test.ID_TESSON
    )
    // See __fixtures__/index.ts for information on number of referents and expected archive date

    // Sandra TESSON has 3 referents but only StructureManager wil receive a notification
    expect(sandraTessonNotifs.length).toBe(1)
    expect(new Set(sandraTessonNotifs.map(n => n.type))).toEqual(
      new Set([NotificationType.ArchiveDueSevenDays])
    )
    const johnDoeNotifs = reminderNotifications.filter(
      n => n.beneficiaryId === test.ID_JOHN_DOE
    )
    expect(johnDoeNotifs.length).toBe(1)
    expect(new Set(johnDoeNotifs.map(n => n.type))).toEqual(
      new Set([NotificationType.ArchiveDueToday])
    )
    expect(new Set(johnDoeNotifs.map(n => n.recipientId))).toEqual(
      new Set([fixturesUsers[FixtureUserRole.StructureManager].id])
    )

    // Even if 2 1-month notifications have been created for Eric DUVERS
    // only the first one should be used to generate the reminder notifications
    // this is permitted by the use of a prisma query using `distinct`
    const ericDuversNotifs = reminderNotifications.filter(
      n => n.beneficiaryId === test.ID_ERIC_DUVERS
    )
    expect(ericDuversNotifs.length).toBe(1)
    expect(new Set(ericDuversNotifs.map(n => n.type))).toEqual(
      new Set([NotificationType.ArchiveDueSevenDays])
    )
    // Eric DUVERS has 3 referents but one of them is inactive
    // He has 3 referents but only StructureManager wil receive a notification
    expect(new Set(ericDuversNotifs.map(n => n.recipientId))).toEqual(
      new Set([fixturesUsers[FixtureUserRole.StructureManager].id])
    )

    // Max has been inactive for more than 2 years so does not receive reminder notifications
    // Instead, a modal will be shown to the agent upon login
    const maxInactiveNotifs = reminderNotifications.filter(
      n => n.beneficiaryId === test.ID_INACTIVE
    )
    expect(maxInactiveNotifs.length).toBe(0)

    expect(reminderNotifications.length).toEqual(3)
  })
})
