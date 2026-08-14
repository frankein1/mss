import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import {
  fixturesUsers,
  fixtureStructures,
  FixtureUserRole,
  FixtureStructure,
  fixturesSocialSupportSubjects
} from '~~/prisma/fixtures'
import {
  FamilyFileRepo,
  BeneficiaryRepo,
  HelpRequestRepo,
  NotificationRepo,
  SocialSupportRepo
} from '~~/server/database'
import dayjs from 'dayjs'
import { faker } from '@faker-js/faker'
import {
  FileInstructionType,
  NotificationType,
  SocialSupportStatus,
  SocialSupportType,
  type BeneficiaryStatus
} from '@prisma/client'
import { prismaClient } from '~~/server/prisma'
import * as socialSupportNotifications from './create-social-support-notifications'

const ID_AUDREY_HORN = faker.string.uuid()
const ID_SECOND_REFERENT = faker.string.uuid()
const ID_INACTIVE_SOCIAL_WORKER = faker.string.uuid()
const beneficiary = {
  id: ID_AUDREY_HORN,
  usualName: 'HORN',
  firstName: 'Audrey',
  fileNumber: ID_AUDREY_HORN,
  status: 'Active' as BeneficiaryStatus,
  structureId: fixtureStructures[0].id
}
const TODAY = dayjs().toDate()
const IN_A_MONTH = dayjs().add(1, 'month').toDate()

beforeEach(async () => await createBeneficiaryWithHelpRequests())
afterEach(async () => await deleteBeneficiary())

describe('Notification - Due Social Support (referent filtering)', () => {
  it('should notify creator and non-excluded referents (SocialWorker, StructureManager, Referent)', async () => {
    await socialSupportNotifications.default.createDueInAMonthSocialSupportNotifications()

    const notifs = await NotificationRepo.prisma.findMany({
      where: {
        type: NotificationType.DueDateOneMonth,
        beneficiaryId: ID_AUDREY_HORN
      }
    })

    // Creator (Referent role) + SocialWorker + StructureManager + Second Referent
    expect(notifs.length).toBe(4)
    expect(
      notifs.some(
        n => n.recipientId === fixturesUsers[FixtureUserRole.Referent].id
      )
    ).toBe(true)
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
    expect(notifs.some(n => n.recipientId === ID_SECOND_REFERENT)).toBe(true)
  })

  it('should not notify ReceptionAgent nor Instructor', async () => {
    await socialSupportNotifications.default.createDueInAMonthSocialSupportNotifications()

    const notifs = await NotificationRepo.prisma.findMany({
      where: {
        type: NotificationType.DueDateOneMonth,
        beneficiaryId: ID_AUDREY_HORN
      }
    })

    expect(
      notifs.some(
        n => n.recipientId === fixturesUsers[FixtureUserRole.ReceptionAgent].id
      )
    ).toBe(false)
    expect(
      notifs.some(
        n => n.recipientId === fixturesUsers[FixtureUserRole.Instructor].id
      )
    ).toBe(false)
    expect(notifs.some(n => n.recipientId === ID_SECOND_REFERENT)).toBe(true)
  })
})

describe('Notification - Due Social Support today (referent filtering)', () => {
  it('should notify creator and non-excluded referents (SocialWorker, StructureManager, Referent)', async () => {
    await socialSupportNotifications.default.createDueTodaySocialSupportNotifications()

    const notifs = await NotificationRepo.prisma.findMany({
      where: {
        type: NotificationType.DueDateToday,
        beneficiaryId: ID_AUDREY_HORN
      }
    })

    // Creator (Referent role) + SocialWorker + StructureManager + Second Referent
    expect(notifs.length).toBe(4)
    expect(
      notifs.some(
        n => n.recipientId === fixturesUsers[FixtureUserRole.Referent].id
      )
    ).toBe(true)
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
    expect(notifs.some(n => n.recipientId === ID_SECOND_REFERENT)).toBe(true)
  })

  it('should not notify ReceptionAgent nor Instructor', async () => {
    await socialSupportNotifications.default.createDueTodaySocialSupportNotifications()

    const notifs = await NotificationRepo.prisma.findMany({
      where: {
        type: NotificationType.DueDateToday,
        beneficiaryId: ID_AUDREY_HORN
      }
    })

    expect(
      notifs.some(
        n => n.recipientId === fixturesUsers[FixtureUserRole.ReceptionAgent].id
      )
    ).toBe(false)
    expect(
      notifs.some(
        n => n.recipientId === fixturesUsers[FixtureUserRole.Instructor].id
      )
    ).toBe(false)
  })
})

describe('Notification - Social Support with handling date', () => {
  it('should notify Referent, SocialWorker and StructureManager for handling date today', async () => {
    await socialSupportNotifications.default.createEndOfSupportTodayHelpRequestNotifications()

    const notifs = await NotificationRepo.prisma.findMany({
      where: {
        type: NotificationType.EndOfSupport,
        beneficiaryId: ID_AUDREY_HORN
      }
    })

    expect(notifs.length).toBe(4)
    expect(
      notifs.some(
        n => n.recipientId === fixturesUsers[FixtureUserRole.Referent].id
      )
    ).toBe(true)
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
    expect(notifs.some(n => n.recipientId === ID_SECOND_REFERENT)).toBe(true)
  })

  it('should notify Referent, SocialWorker and StructureManager for handling date in a month', async () => {
    await socialSupportNotifications.default.createEndOfSupportInAMonthHelpRequestNotifications()

    const notifs = await NotificationRepo.prisma.findMany({
      where: {
        type: NotificationType.EndOfSupportOneMonth,
        beneficiaryId: ID_AUDREY_HORN
      }
    })

    expect(notifs.length).toBe(4)
    expect(
      notifs.some(
        n => n.recipientId === fixturesUsers[FixtureUserRole.Referent].id
      )
    ).toBe(true)
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
    expect(notifs.some(n => n.recipientId === ID_SECOND_REFERENT)).toBe(true)
  })
})

describe('Notification - should not notify inactive referents', () => {
  it('should not notify an inactive SocialWorker referent', async () => {
    await socialSupportNotifications.default.createDueInAMonthSocialSupportNotifications()

    const notifs = await NotificationRepo.prisma.findMany({
      where: {
        type: NotificationType.DueDateOneMonth,
        beneficiaryId: ID_AUDREY_HORN
      }
    })

    expect(notifs.some(n => n.recipientId === ID_INACTIVE_SOCIAL_WORKER)).toBe(
      false
    )
  })
})

const createBeneficiaryWithHelpRequests = async () => {
  await prismaClient.user.createMany({
    data: [
      {
        id: ID_SECOND_REFERENT,
        firstName: 'Second',
        lastName: 'Référent',
        email: 'second.referent.test@yopmail.com',
        role: 'Referent',
        status: 'Active',
        structureId: fixtureStructures[FixtureStructure.Test].id
      },
      {
        id: ID_INACTIVE_SOCIAL_WORKER,
        firstName: 'Inactive',
        lastName: 'SocialWorker',
        email: 'inactive.socialworker.test@yopmail.com',
        role: 'SocialWorker',
        status: 'Disabled',
        structureId: fixtureStructures[FixtureStructure.Test].id
      }
    ]
  })

  const ff = await FamilyFileRepo.prisma.create({
    data: {
      id: ID_AUDREY_HORN,
      structureId: fixtureStructures[0].id,
      referents: {
        connect: [
          { id: fixturesUsers[FixtureUserRole.StructureManager].id },
          { id: fixturesUsers[FixtureUserRole.SocialWorker].id },
          { id: fixturesUsers[FixtureUserRole.ReceptionAgent].id },
          { id: fixturesUsers[FixtureUserRole.Instructor].id },
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

  const helpRequestData = {
    financialSupport: false,
    subject: {
      connect: { id: fixturesSocialSupportSubjects[0].id }
    },
    fileInstruction: {
      create: {
        type: FileInstructionType.Other,
        externalStructure: false,
        socialSupport: {
          create: {
            familyFileId: ff.id,
            beneficiaryId: b.id,
            structureId: fixtureStructures[FixtureStructure.Test].id,
            socialSupportType: SocialSupportType.HelpRequest,
            status: SocialSupportStatus.InProgress,
            createdById: fixturesUsers[FixtureUserRole.Referent].id
          }
        }
      }
    }
  }

  await Promise.all([
    // HelpRequest with handling date today
    HelpRequestRepo.prisma.create({
      data: {
        handlingDate: TODAY,
        ...helpRequestData
      }
    }),
    // HelpRequest with handling date in a month
    HelpRequestRepo.prisma.create({
      data: {
        handlingDate: IN_A_MONTH,
        ...helpRequestData
      }
    }),
    // SocialSupport with dueDate today (for DueDateToday notifications)
    SocialSupportRepo.prisma.create({
      data: {
        familyFileId: ff.id,
        beneficiaryId: b.id,
        structureId: fixtureStructures[FixtureStructure.Test].id,
        socialSupportType: SocialSupportType.Followup,
        status: SocialSupportStatus.InProgress,
        createdById: fixturesUsers[FixtureUserRole.Referent].id,
        dueDate: TODAY
      }
    }),
    // SocialSupport with dueDate in a month (for DueDateOneMonth notifications)
    SocialSupportRepo.prisma.create({
      data: {
        familyFileId: ff.id,
        beneficiaryId: b.id,
        structureId: fixtureStructures[FixtureStructure.Test].id,
        socialSupportType: SocialSupportType.Followup,
        status: SocialSupportStatus.InProgress,
        createdById: fixturesUsers[FixtureUserRole.Referent].id,
        dueDate: IN_A_MONTH
      }
    })
  ])
}

const deleteBeneficiary = async () => {
  await FamilyFileRepo.prisma.delete({
    where: { id: ID_AUDREY_HORN }
  })
  await prismaClient.user.deleteMany({
    where: { id: { in: [ID_SECOND_REFERENT, ID_INACTIVE_SOCIAL_WORKER] } }
  })
}
