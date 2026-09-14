import dayjs from 'dayjs'
import {
  BeneficiaryRepo,
  FamilyFileRepo,
  NotificationRepo
} from '~~/server/database'
import {
  FixtureBeneficiary,
  fixturesBeneficiaries,
  fixtureStructures,
  fixturesUsers,
  FixtureUserRole
} from '~~/prisma/fixtures'

const ID_JOHN_DOE = '06581dca-5a11-4ca4-a3b6-65f6b6a4afb7'
const ID_JANE = '25ed4fd5-a05f-49f6-bcec-0cf3c60fd629'
const ID_GRECO = 'e1762d40-577f-4eea-87e1-819173cf0be6'
const ID_DOC = '0db7b12a-ab44-46eb-a7b3-aabbc7900cb2'
const ID_TONY_MARTIN = '79968e3c-7a22-4549-a3b2-585e1e3db1dd'
const ID_TANIA_ANDRE = 'fadea3d1-eda2-4af7-ba03-6b9db82c2f4d'
const ID_ERIC_DUVERS = '183446e7-8501-48c5-8803-8c2980746b2d'
const ID_TESSON = fixturesBeneficiaries[FixtureBeneficiary.TESSON].id
const ID_INACTIVE = fixturesBeneficiaries[FixtureBeneficiary.INACTIVE].id

const threeYearsBeforeNow = dayjs().subtract(3, 'year').toDate()
const twoYearsBeforeNow = dayjs().subtract(2, 'year').add(1, 'day').toDate()
const twoYearsMinusTwoDaysBefore = dayjs()
  .subtract(2, 'year')
  .add(2, 'days')
  .toDate()
const twoDaysAgo = dayjs().subtract(2, 'days').toDate()

/** Family files and beneficiaries fixtures
 * - John DOE         : INACTIVE - EXPECTED ARCHIVE DATE: TODAY
 * - Jane DOE         :   ACTIVE
 * - Lena GRECO       :   ACTIVE
 * - Martine DOCUMENT :   ACTIVE
 * - Tony MARTIN      :   ACTIVE
 * - Tania ANDRE      :   ACTIVE
 * - Eric DUVERS      : INACTIVE - EXPECTED ARCHIVE DATE: IN 2 DAYS
 */
const createBeneficiary = async () => {
  const [familyFileDoe, familyFileGreco, ffMartin, ffAndre, ffDuvers] =
    await Promise.all([
      FamilyFileRepo.prisma.create({
        data: {
          id: ID_JOHN_DOE,
          structureId: fixtureStructures[0].id,
          referents: {
            connect: [
              { id: fixturesUsers[FixtureUserRole.StructureManager].id }
            ]
          }
        }
      }),
      FamilyFileRepo.prisma.create({
        data: {
          id: ID_GRECO,
          structureId: fixtureStructures[0].id,
          referents: {
            connect: [
              { id: fixturesUsers[FixtureUserRole.StructureManager].id }
            ]
          }
        }
      }),
      FamilyFileRepo.prisma.create({
        data: {
          id: ID_TONY_MARTIN,
          structureId: fixtureStructures[0].id,
          referents: {
            connect: [
              { id: fixturesUsers[FixtureUserRole.StructureManager].id }
            ]
          }
        }
      }),
      FamilyFileRepo.prisma.create({
        data: {
          id: ID_TANIA_ANDRE,
          structureId: fixtureStructures[0].id,
          referents: {
            connect: [
              { id: fixturesUsers[FixtureUserRole.StructureManager].id }
            ]
          }
        }
      }),
      FamilyFileRepo.prisma.create({
        data: {
          id: ID_ERIC_DUVERS,
          structureId: fixtureStructures[0].id,
          referents: {
            connect: [
              { id: fixturesUsers[FixtureUserRole.StructureManager].id },
              { id: fixturesUsers[FixtureUserRole.Referent].id },
              { id: fixturesUsers[FixtureUserRole.Instructor].id }
            ]
          }
        }
      })
    ])

  await Promise.all([
    BeneficiaryRepo.prisma.create({
      data: {
        id: ID_JOHN_DOE,
        familyFileId: familyFileDoe.id,
        fileNumber: 'XOXOXOXOXO',
        structureId: fixtureStructures[0].id,
        status: 'Active',
        usualName: 'DOE',
        firstName: 'John',
        created: twoYearsBeforeNow,
        updated: threeYearsBeforeNow,
        lastActivity: twoYearsBeforeNow
      }
    }),
    BeneficiaryRepo.prisma.create({
      data: {
        id: ID_JANE,
        familyFileId: familyFileDoe.id,
        fileNumber: 'KEKEKEKEKE',
        structureId: fixtureStructures[0].id,
        status: 'Active',
        usualName: 'DOE',
        firstName: 'Jane',
        created: threeYearsBeforeNow,
        updated: twoDaysAgo,
        lastActivity: twoDaysAgo
      }
    }),
    BeneficiaryRepo.prisma.create({
      data: {
        id: ID_GRECO,
        familyFileId: familyFileGreco.id,
        fileNumber: 'LOLOLOLOLO',
        structureId: fixtureStructures[0].id,
        status: 'Active',
        usualName: 'GRECO',
        firstName: 'Lena',
        created: threeYearsBeforeNow,
        updated: twoDaysAgo,
        lastActivity: twoDaysAgo
      }
    }),
    BeneficiaryRepo.prisma.create({
      data: {
        id: ID_DOC,
        familyFileId: familyFileDoe.id,
        fileNumber: 'DODODODODO',
        structureId: fixtureStructures[0].id,
        status: 'Active',
        usualName: 'DOCUMENT',
        firstName: 'Martine',
        created: threeYearsBeforeNow,
        updated: twoDaysAgo,
        lastActivity: twoDaysAgo
      }
    }),
    BeneficiaryRepo.prisma.create({
      data: {
        id: ID_TONY_MARTIN,
        familyFileId: ffMartin.id,
        fileNumber: '893DD5AEQZ',
        structureId: fixtureStructures[0].id,
        status: 'Active',
        usualName: 'MARTINE',
        firstName: 'Tony',
        created: threeYearsBeforeNow,
        updated: twoDaysAgo,
        lastActivity: twoDaysAgo
      }
    }),
    BeneficiaryRepo.prisma.create({
      data: {
        id: ID_TANIA_ANDRE,
        familyFileId: ffAndre.id,
        fileNumber: 'WMAZJJQ5CE',
        structureId: fixtureStructures[0].id,
        status: 'Active',
        usualName: 'ANDRE',
        firstName: 'Tania',
        created: threeYearsBeforeNow,
        updated: twoDaysAgo,
        lastActivity: twoDaysAgo
      }
    }),
    BeneficiaryRepo.prisma.create({
      data: {
        id: ID_ERIC_DUVERS,
        familyFileId: ffDuvers.id,
        fileNumber: 'F8RR75R1EC',
        structureId: fixtureStructures[0].id,
        status: 'Active',
        usualName: 'DUVERS',
        firstName: 'Eric',
        created: threeYearsBeforeNow,
        updated: twoYearsMinusTwoDaysBefore,
        lastActivity: twoYearsMinusTwoDaysBefore
      }
    })
  ])
}

const deleteBeneficiary = async () => {
  await NotificationRepo.prisma.deleteMany({
    where: { beneficiaryId: { in: [ID_TESSON, ID_INACTIVE] } }
  })
  await FamilyFileRepo.prisma.deleteMany({
    where: {
      id: {
        in: [
          ID_JOHN_DOE,
          ID_GRECO,
          ID_DOC,
          ID_TONY_MARTIN,
          ID_TANIA_ANDRE,
          ID_ERIC_DUVERS
        ]
      }
    }
  })
}

export const test = {
  createBeneficiary,
  deleteBeneficiary,
  ID_JOHN_DOE,
  ID_JANE,
  ID_GRECO,
  ID_DOC,
  ID_TONY_MARTIN,
  ID_TANIA_ANDRE,
  ID_ERIC_DUVERS,
  ID_TESSON,
  ID_INACTIVE,
  twoYearsBeforeNow
}
