import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getInactiveBeneficiaries } from './archiveNotifications'
import { FamilyFileRepo } from '../database'
import {
  fixturesSocialSupportSubjects,
  fixtureStructures,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { prismaClient } from '~/server/prisma'
import { v4 } from 'uuid'
import dayjs from 'dayjs'

type Beneficiaries = Awaited<ReturnType<typeof createBeneficiaries>>
let beneficiaries: Beneficiaries = []
const ALTREIDES = 'ALTREIDES'
const threeYearsBeforeNow = dayjs().subtract(3, 'year').toDate()
const twoDaysBeforeNow = dayjs().subtract(2, 'days').toDate()
const twoDaysAfterNow = dayjs().add(2, 'days').toDate()

beforeAll(async () => {
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
  await FamilyFileRepo.prisma.delete({
    where: {
      id: beneficiaries[0].familyFileId
    }
  })
}
