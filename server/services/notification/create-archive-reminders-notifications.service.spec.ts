import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach
} from 'vitest'
import { NotificationRepo } from '~/server/database'
import { fixturesUsers, FixtureUserRole } from '~/prisma/fixtures'
import { NotificationType } from '@prisma/client'
import { test } from './__fixtures__'
import { createArchiveDueRemindersNotifications } from './create-archive-reminders-notifications.service'
import { BeneficiaryService } from '~/server/services'

beforeAll(async () => await test.createBeneficiary())

afterAll(async () => await test.deleteBeneficiary())

describe('Notification - Beneficiary Archive - Create reminder notifications', () => {
  const ids = [
    '70663589-8292-4cbf-aafd-e6318cde110a',
    '382b750a-7efd-4019-a542-d4cf37aa3f1b',
    '9e161fd4-54e5-4967-9d8c-eaf03cd0445f',
    'f8d88a21-26cd-4b29-bf1d-227c71a883b6',
    '224a944f-f789-47d6-b8c7-0340faff4055'
  ]

  let createdNotificationIds: string[] = []

  beforeEach(
    async () =>
      await NotificationRepo.prisma.createMany({
        data: [
          {
            id: ids[0],
            type: NotificationType.ArchiveDueOneMonth,
            beneficiaryId: test.ID_JOHN_DOE,
            recipientId: fixturesUsers[FixtureUserRole.StructureManager].id,
            archiveDate: BeneficiaryService.getArchiveDate(
              await BeneficiaryService.getLastActivity({
                ctx: {} as any,
                beneficiaryId: test.ID_JOHN_DOE
              }),
              null
            )
          },
          {
            id: ids[1],
            type: NotificationType.ArchiveDueOneMonth,
            beneficiaryId: test.ID_INACTIVE,
            recipientId: fixturesUsers[FixtureUserRole.StructureManager].id,
            archiveDate: BeneficiaryService.getArchiveDate(
              await BeneficiaryService.getLastActivity({
                ctx: {} as any,
                beneficiaryId: test.ID_INACTIVE
              }),
              null
            )
          },
          {
            id: ids[2],
            type: NotificationType.ArchiveDueOneMonth,
            beneficiaryId: test.ID_INACTIVE,
            recipientId: fixturesUsers[FixtureUserRole.Referent].id,
            archiveDate: BeneficiaryService.getArchiveDate(
              await BeneficiaryService.getLastActivity({
                ctx: {} as any,
                beneficiaryId: test.ID_INACTIVE
              }),
              null
            )
          },
          {
            id: ids[3],
            type: NotificationType.ArchiveDueOneMonth,
            beneficiaryId: test.ID_ERIC_DUVERS,
            recipientId: fixturesUsers[FixtureUserRole.StructureManager].id,
            archiveDate: BeneficiaryService.getArchiveDate(
              await BeneficiaryService.getLastActivity({
                ctx: {} as any,
                beneficiaryId: test.ID_ERIC_DUVERS
              }),
              null
            )
          },
          {
            id: ids[4],
            type: NotificationType.ArchiveDueOneMonth,
            beneficiaryId: test.ID_ERIC_DUVERS,
            recipientId: fixturesUsers[FixtureUserRole.Referent].id,
            archiveDate: BeneficiaryService.getArchiveDate(
              await BeneficiaryService.getLastActivity({
                ctx: {} as any,
                beneficiaryId: test.ID_ERIC_DUVERS
              }),
              null
            )
          }
        ]
      })
  )

  afterEach(
    async () =>
      await NotificationRepo.prisma.deleteMany({
        where: { id: { in: [...ids, ...createdNotificationIds] } }
      })
  )

  it('should create reminder notifications for John Doe, Eric Duvers and Max Inactive', async () => {
    await createArchiveDueRemindersNotifications()
    const notifs = await NotificationRepo.prisma.findMany({
      where: {
        type: {
          in: [
            NotificationType.ArchiveDueToday,
            NotificationType.ArchiveDueSevenDays
          ]
        }
      }
    })
    createdNotificationIds = notifs.map(n => n.id)

    // See __fixtures__/index.ts for information on number of referents and expected archive date
    const johnDoeNotifs = notifs.filter(
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
    const ericDuversNotifs = notifs.filter(
      n => n.beneficiaryId === test.ID_ERIC_DUVERS
    )
    expect(ericDuversNotifs.length).toBe(2)
    expect(new Set(ericDuversNotifs.map(n => n.type))).toEqual(
      new Set([NotificationType.ArchiveDueSevenDays])
    )
    // Eric DUVERS has 3 referents but one of them is inactive
    expect(new Set(ericDuversNotifs.map(n => n.recipientId))).toEqual(
      new Set([
        fixturesUsers[FixtureUserRole.StructureManager].id,
        fixturesUsers[FixtureUserRole.Referent].id
      ])
    )

    // Max has been inactive for more than 2 years so does not receive reminder notifications
    // Instead, a modal will be shown to the agent upon login
    const maxInactiveNotifs = notifs.filter(
      n => n.beneficiaryId === test.ID_INACTIVE
    )
    expect(maxInactiveNotifs.length).toBe(0)

    expect(notifs.length).toEqual(3)
  })

  it('should not create notifications that already exist for the same due date', async () => {
    await createArchiveDueRemindersNotifications()
    await createArchiveDueRemindersNotifications()

    const notifs = await NotificationRepo.prisma.findMany({
      where: {
        type: {
          in: [
            NotificationType.ArchiveDueToday,
            NotificationType.ArchiveDueSevenDays
          ]
        }
      }
    })
    createdNotificationIds = notifs.map(n => n.id)

    expect(notifs.length).toEqual(3)
  })
})
