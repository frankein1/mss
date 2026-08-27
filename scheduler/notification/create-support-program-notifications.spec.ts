import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import {
  fixturesUsers,
  fixtureStructures,
  FixtureUserRole,
  FixtureStructure
} from '~~/prisma/fixtures'
import {
  FamilyFileRepo,
  BeneficiaryRepo,
  NotificationRepo
} from '~~/server/database'
import dayjs from 'dayjs'
import { faker } from '@faker-js/faker'
import {
  NotificationType,
  SocialSupportStatus,
  SocialSupportType,
  type BeneficiaryStatus,
  type Notification
} from '@prisma/client'
import { prismaClient } from '~~/server/prisma'
import * as supportProgramNotifications from './create-support-program-notifications'

const ID_AGNES_VARDA = faker.string.uuid()
const ID_SECOND_REFERENT = faker.string.uuid()
const ID_INACTIVE_SOCIAL_WORKER = faker.string.uuid()
const ID_PROGRAM_ENDING_TODAY = faker.string.uuid()
const ID_PROGRAM_ENDING_IN_A_MONTH = faker.string.uuid()
const ID_PROGRAM_WITHOUT_END_DATE = faker.string.uuid()
const ID_PROGRAM_NAME = faker.string.uuid()
const PROGRAM_NAME = 'Dispositif de test fin de parcours'

const beneficiary = {
  id: ID_AGNES_VARDA,
  firstName: 'Agnès',
  usualName: 'VARDA',
  fileNumber: ID_AGNES_VARDA,
  status: 'Active' as BeneficiaryStatus,
  structureId: fixtureStructures[0].id
}
const TODAY = dayjs().toDate()
const IN_A_MONTH = dayjs().add(1, 'month').toDate()

beforeEach(async () => await createBeneficiaryWithSupportPrograms())
afterEach(async () => await deleteBeneficiary())

describe('Notification - Support program ending in a month', () => {
  it('should notify eligible referents (SocialWorker, StructureManager, Referent)', async () => {
    await supportProgramNotifications.default.createEndInAMonthSupportProgramNotifications()

    const notifs: Pick<Notification, 'recipientId'>[] =
      await NotificationRepo.prisma.findMany({
        where: {
          type: NotificationType.SupportProgramEndOneMonth,
          beneficiaryId: ID_AGNES_VARDA
        },
        select: {
          recipientId: true
        }
      })

    expect(
      notifs.some(
        n => n.recipientId === fixturesUsers[FixtureUserRole.SocialWorker].id
      )
    ).toBe(true)
    expect(
      notifs.some(
        n =>
          n.recipientId === fixturesUsers[FixtureUserRole.StructureManager].id
      )
    ).toBe(true)
    expect(
      notifs.some(
        n => n.recipientId === fixturesUsers[FixtureUserRole.Referent].id
      )
    ).toBe(true)
    expect(notifs.some(n => n.recipientId === ID_SECOND_REFERENT)).toBe(true)
  })

  it('should target the support program and carry its name as detail', async () => {
    await supportProgramNotifications.default.createEndInAMonthSupportProgramNotifications()

    const notifs: Pick<Notification, 'supportProgramId' | 'detail'>[] =
      await NotificationRepo.prisma.findMany({
        where: {
          type: NotificationType.SupportProgramEndOneMonth,
          beneficiaryId: ID_AGNES_VARDA
        },
        select: {
          supportProgramId: true,
          detail: true
        }
      })

    expect(notifs.length).toBeGreaterThan(0)
    expect(
      notifs.every(n => n.supportProgramId === ID_PROGRAM_ENDING_IN_A_MONTH)
    ).toBe(true)
    expect(notifs.every(n => n.detail === PROGRAM_NAME)).toBe(true)
  })
})

describe('Notification - Support program ending today', () => {
  it('should notify eligible referents (SocialWorker, StructureManager, Referent)', async () => {
    await supportProgramNotifications.default.createEndTodaySupportProgramNotifications()

    const notifs: Pick<Notification, 'recipientId'>[] =
      await NotificationRepo.prisma.findMany({
        where: {
          type: NotificationType.SupportProgramEndToday,
          beneficiaryId: ID_AGNES_VARDA
        },
        select: {
          recipientId: true
        }
      })

    expect(
      notifs.some(
        n => n.recipientId === fixturesUsers[FixtureUserRole.SocialWorker].id
      )
    ).toBe(true)
    expect(
      notifs.some(
        n =>
          n.recipientId === fixturesUsers[FixtureUserRole.StructureManager].id
      )
    ).toBe(true)
    expect(
      notifs.some(
        n => n.recipientId === fixturesUsers[FixtureUserRole.Referent].id
      )
    ).toBe(true)
    expect(notifs.some(n => n.recipientId === ID_SECOND_REFERENT)).toBe(true)
  })

  it('should notify the creator of an attached social support whatever their role', async () => {
    await supportProgramNotifications.default.createEndTodaySupportProgramNotifications()

    const notifs: Pick<Notification, 'recipientId'>[] =
      await NotificationRepo.prisma.findMany({
        where: {
          type: NotificationType.SupportProgramEndToday,
          beneficiaryId: ID_AGNES_VARDA
        },
        select: {
          recipientId: true
        }
      })

    // Instructor is not an eligible referent role, but this user created a
    // social support attached to the program ending today
    expect(
      notifs.some(
        n =>
          n.recipientId === fixturesUsers[FixtureUserRole.InstructorActive].id
      )
    ).toBe(true)
  })

  it('should not notify ReceptionAgent nor inactive users', async () => {
    await supportProgramNotifications.default.createEndTodaySupportProgramNotifications()

    const notifs: Pick<Notification, 'recipientId'>[] =
      await NotificationRepo.prisma.findMany({
        where: {
          type: NotificationType.SupportProgramEndToday,
          beneficiaryId: ID_AGNES_VARDA
        },
        select: {
          recipientId: true
        }
      })

    expect(
      notifs.some(
        n => n.recipientId === fixturesUsers[FixtureUserRole.ReceptionAgent].id
      )
    ).toBe(false)
    expect(notifs.some(n => n.recipientId === ID_INACTIVE_SOCIAL_WORKER)).toBe(
      false
    )
  })
})

describe('Notification - Support program without end date', () => {
  it('should never be notified', async () => {
    await supportProgramNotifications.default.createEndTodaySupportProgramNotifications()
    await supportProgramNotifications.default.createEndInAMonthSupportProgramNotifications()

    const notifs: Pick<Notification, 'recipientId'>[] =
      await NotificationRepo.prisma.findMany({
        where: { supportProgramId: ID_PROGRAM_WITHOUT_END_DATE },
        select: {
          recipientId: true
        }
      })

    expect(notifs.length).toBe(0)
  })
})

// create and delete utils for this test
const createBeneficiaryWithSupportPrograms = async () => {
  await prismaClient.user.createMany({
    data: [
      {
        id: ID_SECOND_REFERENT,
        firstName: 'Second',
        lastName: 'Référent',
        email: 'second.referent.support-program@yopmail.com',
        role: 'Referent',
        status: 'Active',
        structureId: fixtureStructures[FixtureStructure.Test].id
      },
      {
        id: ID_INACTIVE_SOCIAL_WORKER,
        firstName: 'Inactive',
        lastName: 'SocialWorker',
        email: 'inactive.socialworker.support-program@yopmail.com',
        role: 'SocialWorker',
        status: 'Disabled',
        structureId: fixtureStructures[FixtureStructure.Test].id
      }
    ]
  })

  const ff = await FamilyFileRepo.prisma.create({
    data: {
      id: ID_AGNES_VARDA,
      structureId: fixtureStructures[0].id,
      referents: {
        connect: [
          { id: fixturesUsers[FixtureUserRole.StructureManager].id },
          { id: fixturesUsers[FixtureUserRole.SocialWorker].id },
          { id: fixturesUsers[FixtureUserRole.ReceptionAgent].id },
          { id: fixturesUsers[FixtureUserRole.InstructorActive].id },
          { id: fixturesUsers[FixtureUserRole.Referent].id },
          { id: ID_SECOND_REFERENT },
          { id: ID_INACTIVE_SOCIAL_WORKER }
        ]
      }
    }
  })

  const b = await BeneficiaryRepo.prisma.create({
    data: {
      ...beneficiary,
      familyFileId: ff.id
    }
  })

  await prismaClient.supportProgramName.create({
    data: {
      id: ID_PROGRAM_NAME,
      name: PROGRAM_NAME,
      hasLifecycle: true,
      structureId: fixtureStructures[FixtureStructure.Test].id,
      createdById: fixturesUsers[FixtureUserRole.StructureManager].id
    }
  })

  await prismaClient.supportProgram.createMany({
    data: [
      {
        id: ID_PROGRAM_ENDING_TODAY,
        beneficiaryId: b.id,
        supportProgramNameId: ID_PROGRAM_NAME,
        endDate: TODAY
      },
      {
        id: ID_PROGRAM_ENDING_IN_A_MONTH,
        beneficiaryId: b.id,
        supportProgramNameId: ID_PROGRAM_NAME,
        endDate: IN_A_MONTH
      },
      {
        id: ID_PROGRAM_WITHOUT_END_DATE,
        beneficiaryId: b.id,
        supportProgramNameId: ID_PROGRAM_NAME,
        endDate: null
      }
    ]
  })

  // Attached to the program ending today, created by a non-referent role
  await prismaClient.socialSupport.create({
    data: {
      familyFileId: ff.id,
      beneficiaryId: b.id,
      structureId: fixtureStructures[FixtureStructure.Test].id,
      socialSupportType: SocialSupportType.Followup,
      status: SocialSupportStatus.InProgress,
      createdById: fixturesUsers[FixtureUserRole.InstructorActive].id,
      supportProgramId: ID_PROGRAM_ENDING_TODAY
    }
  })
}

// deleteMany is used throughout so that a partially failed setup still gets
// fully cleaned up: tests share a global context (vitest `isolate: false`)
const deleteBeneficiary = async () => {
  // cascades to the beneficiary, its support programs, their notifications
  // and the attached social support
  await prismaClient.familyFile.deleteMany({
    where: { id: ID_AGNES_VARDA }
  })
  await prismaClient.supportProgramName.deleteMany({
    where: { id: ID_PROGRAM_NAME }
  })
  await prismaClient.user.deleteMany({
    where: { id: { in: [ID_SECOND_REFERENT, ID_INACTIVE_SOCIAL_WORKER] } }
  })
}
