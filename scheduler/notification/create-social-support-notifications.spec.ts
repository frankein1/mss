import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import {
  fixturesUsers,
  fixtureStructures,
  FixtureUserRole,
  FixtureStructure,
  fixturesSocialSupportSubjects
} from '~/prisma/fixtures'
import {
  FamilyFileRepo,
  BeneficiaryRepo,
  HelpRequestRepo,
  NotificationRepo
} from '~/server/database'
import dayjs from 'dayjs'
import { faker } from '@faker-js/faker'
import {
  FileInstructionType,
  NotificationType,
  SocialSupportStatus,
  SocialSupportType,
  type BeneficiaryStatus
} from '@prisma/client'
import * as socialSupportNotifications from './create-social-support-notifications'

const ID_AUDREY_HORN = faker.string.uuid()
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

describe('Notification - Social Support', () => {
  it('should have ONE notification for handling date today', async () => {
    await socialSupportNotifications.default.createEndOfSupportTodayHelpRequestNotifications()

    const notifs = await NotificationRepo.prisma.findMany({
      where: {
        type: NotificationType.EndOfSupport,
        beneficiaryId: ID_AUDREY_HORN
      }
    })

    expect(notifs.length).toBe(1)
  })

  it('should have ONE notification for handling date in a month', async () => {
    await socialSupportNotifications.default.createEndOfSupportInAMonthHelpRequestNotifications()

    const notifs = await NotificationRepo.prisma.findMany({
      where: {
        type: NotificationType.EndOfSupportOneMonth,
        beneficiaryId: ID_AUDREY_HORN
      }
    })

    expect(notifs.length).toBe(1)
  })
})

const createBeneficiaryWithHelpRequests = async () => {
  const ff = await FamilyFileRepo.prisma.create({
    data: {
      id: ID_AUDREY_HORN,
      structureId: fixtureStructures[0].id,
      referents: {
        connect: [{ id: fixturesUsers[FixtureUserRole.StructureManager].id }]
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
    // HelpRequest with handling date in a mouth
    HelpRequestRepo.prisma.create({
      data: {
        handlingDate: IN_A_MONTH,
        ...helpRequestData
      }
    })
  ])
}

const deleteBeneficiary = async () => {
  await FamilyFileRepo.prisma.delete({
    where: {
      id: ID_AUDREY_HORN
    }
  })
}
