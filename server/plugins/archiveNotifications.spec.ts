import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import {
  filteredArchiveNotifications,
  getInactiveBeneficiaries
} from './archiveNotifications'
import { FamilyFileRepo, NotificationRepo } from '../database'
import {
  FixtureBeneficiary,
  fixturesBeneficiaries,
  fixturesSocialSupportSubjects,
  fixtureStructures,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { NotificationType } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { v4 } from 'uuid'
import dayjs from 'dayjs'

type Notifications = Awaited<ReturnType<typeof createNotifications>>
let notifications: Notifications = []
type Beneficiaries = Awaited<ReturnType<typeof createBeneficiaries>>
let beneficiaries: Beneficiaries = []
const ALTREIDES = 'ALTREIDES'
const threeYearsBeforeNow = dayjs().subtract(3, 'year').toDate()
const twoDaysBeforeNow = dayjs().subtract(2, 'days').toDate()
const twoDaysAfterNow = dayjs().add(2, 'days').toDate()

beforeAll(async () => {
  notifications = await createNotifications()
  beneficiaries = await createBeneficiaries()
})

afterAll(async () => {
  await resetDatabaseAfterTest()
})

describe('getInactiveBeneficiaries', () => {
  it('should return 3 beneficiaries', async () => {
    const beneficiaries = await getInactiveBeneficiaries()
    expect(beneficiaries.length).toEqual(3)
  })
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

const createBeneficiaries = async () => {
  const familyFile = await prismaClient.familyFile.create({
    data: {
      structureId: fixtureStructures[0].id,
      referents: {
        connect: [{ id: fixturesUsers[FixtureUserRole.StructureManager].id }]
      }
    }
  })
  const budget = await prismaClient.budget.create({
    data: {
      familyFileId: familyFile.id,
      created: threeYearsBeforeNow,
      updated: threeYearsBeforeNow
    }
  })
  await prismaClient.budgetExpenses.create({
    data: {
      budgetId: budget.id,
      created: threeYearsBeforeNow,
      updated: threeYearsBeforeNow
    }
  })
  await prismaClient.budgetIncome.createManyAndReturn({
    data: [
      {
        type: 'Beneficiary',
        budgetId: budget.id,
        created: threeYearsBeforeNow,
        updated: threeYearsBeforeNow
      },
      {
        type: 'HouseholdMember',
        budgetId: budget.id,
        created: threeYearsBeforeNow,
        updated: threeYearsBeforeNow
      }
    ]
  })

  const beneficiaries = await prismaClient.beneficiary.createManyAndReturn({
    data: [
      {
        // Must be archive (1)
        fileNumber: v4(),
        structureId: fixtureStructures[0].id,
        status: 'Active',
        usualName: ALTREIDES,
        firstName: 'Jessica',
        familyFileId: familyFile.id,
        created: threeYearsBeforeNow,
        updated: threeYearsBeforeNow
      },
      {
        // not archive
        fileNumber: v4(),
        structureId: fixtureStructures[0].id,
        status: 'Active',
        usualName: ALTREIDES,
        firstName: 'Paul',
        familyFileId: familyFile.id,
        created: twoDaysBeforeNow,
        updated: twoDaysBeforeNow
      },
      {
        // Must be archive (2)
        fileNumber: v4(),
        structureId: fixtureStructures[0].id,
        status: 'Active',
        usualName: ALTREIDES,
        firstName: 'Leto',
        familyFileId: familyFile.id,
        created: threeYearsBeforeNow,
        updated: threeYearsBeforeNow,
        archiveDueDate: twoDaysBeforeNow
      },
      {
        // not archive
        fileNumber: v4(),
        structureId: fixtureStructures[0].id,
        status: 'Active',
        usualName: ALTREIDES,
        firstName: 'Leto',
        familyFileId: familyFile.id,
        created: threeYearsBeforeNow,
        updated: threeYearsBeforeNow,
        archiveDueDate: threeYearsBeforeNow
      },
      {
        // not archive
        fileNumber: v4(),
        structureId: fixtureStructures[0].id,
        status: 'Active',
        usualName: ALTREIDES,
        firstName: 'Feyd',
        familyFileId: familyFile.id,
        created: threeYearsBeforeNow,
        updated: twoDaysBeforeNow,
        archiveDueDate: threeYearsBeforeNow
      },
      {
        //  Must be archive (3)
        fileNumber: v4(),
        structureId: fixtureStructures[0].id,
        status: 'Active',
        usualName: ALTREIDES,
        firstName: 'Rabban',
        familyFileId: familyFile.id,
        created: threeYearsBeforeNow,
        updated: threeYearsBeforeNow,
        archiveDueDate: twoDaysAfterNow
      }
    ]
  })
  prismaClient.socialSupport.create({
    data: {
      createdById: fixturesUsers[FixtureUserRole.Referent].id,
      status: 'Done',
      structureId: fixtureStructures[0].id,
      beneficiaryId: beneficiaries[0].id,
      familyFileId: familyFile.id,
      subjects: {
        connect: [
          { id: fixturesSocialSupportSubjects[0].id },
          { id: fixturesSocialSupportSubjects[1].id }
        ]
      },
      date: threeYearsBeforeNow,
      socialSupportType: 'Followup',
      followup: {
        create: {
          medium: 'PlannedInPerson'
        }
      }
    }
  })
  return beneficiaries
}

const resetDatabaseAfterTest = async () => {
  await NotificationRepo.prisma.deleteMany({
    where: {
      id: {
        in: [notifications[0].id, notifications[1].id]
      }
    }
  })
  await FamilyFileRepo.prisma.delete({
    where: {
      id: beneficiaries[0].familyFileId
    }
  })
}
