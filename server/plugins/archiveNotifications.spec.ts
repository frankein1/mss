import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { filteredArchiveNotifications } from './archiveNotifications'
import { NotificationRepo } from '../database'
import {
  FixtureBeneficiary,
  fixturesBeneficiaries,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { NotificationType } from '@prisma/client'
import { prismaClient } from '~/server/prisma'

type Notifications = Awaited<ReturnType<typeof createNotifications>>
let notifications: Notifications = []

beforeAll(async () => {
  notifications = await createNotifications()
})

afterAll(async () => {
  await resetDatabaseAfterTest()
})

describe('filteredArchiveNotifications', () => {
  it('array is empty as notification already exists', async () => {
    const filteredNotifications =
      await filteredArchiveNotifications(fixtureNotifications)
    expect(filteredNotifications.length).toEqual(0)
  })
  it('array length is 2', async () => {
    const filteredNotifications = await filteredArchiveNotifications([
      {
        archiveDate: new Date('December 17, 1995 03:24:00'),
        beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.APFELMANN].id, // is different
        recipientId: fixturesUsers[FixtureUserRole.Instructor].id,
        type: NotificationType.ArchiveDue
      },
      {
        archiveDate: new Date('December 17, 1995 03:24:00'),
        beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.MARTIN].id,
        recipientId: fixturesUsers[FixtureUserRole.SocialWorker].id, // is different
        type: NotificationType.ArchiveDue
      }
    ])
    expect(filteredNotifications.length).toEqual(2)
  })
  it('array length is 1', async () => {
    const filteredNotifications = await filteredArchiveNotifications([
      {
        archiveDate: new Date('December 17, 1995 03:24:00'),
        beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id,
        recipientId: fixturesUsers[FixtureUserRole.Instructor].id,
        type: NotificationType.ArchiveDue
      },
      {
        archiveDate: new Date('December 17, 1995 03:24:00'),
        beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.MARTIN].id,
        recipientId: fixturesUsers[FixtureUserRole.SocialWorker].id, // is different
        type: NotificationType.ArchiveDue
      }
    ])
    expect(filteredNotifications.length).toEqual(1)
  })
})

const fixtureNotifications = [
  {
    archiveDate: new Date('December 17, 1995 03:24:00'),
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id,
    recipientId: fixturesUsers[FixtureUserRole.Instructor].id,
    type: NotificationType.ArchiveDue
  },
  {
    archiveDate: new Date('December 17, 1995 03:24:00'),
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.MARTIN].id,
    recipientId: fixturesUsers[FixtureUserRole.Referent].id,
    type: NotificationType.ArchiveDue
  }
]

const createNotifications = async () => {
  return await prismaClient.notification.createManyAndReturn({
    data: fixtureNotifications
  })
}

const resetDatabaseAfterTest = async () => {
  await NotificationRepo.prisma.deleteMany({
    where: {
      id: {
        in: [notifications[0].id, notifications[1].id]
      }
    }
  })
}
