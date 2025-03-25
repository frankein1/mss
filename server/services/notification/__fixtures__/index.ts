import dayjs from 'dayjs'
import { BeneficiaryRepo, FamilyFileRepo } from '~/server/database'
import {
  FixtureBeneficiary,
  fixturesBeneficiaries,
  fixtureStructures,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { BudgetIncomeType, DocumentType } from '@prisma/client'

const ID_JOHN_DOE = '06581dca-5a11-4ca4-a3b6-65f6b6a4afb7'
const UUID_JANE = '25ed4fd5-a05f-49f6-bcec-0cf3c60fd629'
const UUID_GRECO = 'e1762d40-577f-4eea-87e1-819173cf0be6'
const UUID_DOC = '0db7b12a-ab44-46eb-a7b3-aabbc7900cb2'
const ID_TONY_MARTIN = '79968e3c-7a22-4549-a3b2-585e1e3db1dd'
const ID_TANIA_ANDRE = 'fadea3d1-eda2-4af7-ba03-6b9db82c2f4d'
const ID_ERIC_DUVERS = '183446e7-8501-48c5-8803-8c2980746b2d'
const ID_TESSON = fixturesBeneficiaries[FixtureBeneficiary.TESSON].id
const ID_INACTIVE = fixturesBeneficiaries[FixtureBeneficiary.INACTIVE].id

const threeYearsBeforeNow = dayjs().subtract(3, 'year').toDate()
const twoYearsBeforeNow = dayjs().subtract(2, 'year').toDate()
const twoYearsMinusTwoDaysBefore = dayjs()
  .subtract(2, 'year')
  .add(2, 'days')
  .toDate()
const twoDaysAgo = dayjs().subtract(2, 'days').toDate()

/** Family files and beneficiaries fixtures
 * - John DOE         : INACTIVE (old profile, old budget, old incomes) - EXPECTED ARCHIVE DATE: TODAY
 * - Jane DOE         :   ACTIVE (old profile, old budget, old incomes, recent social supports)
 * - Lena GRECO       :   ACTIVE (old profile, old budget, recent incomes)
 * - Martine DOCUMENT :   ACTIVE (old profile, old budget, old incomes, recent documents)
 * - Tony MARTIN      :   ACTIVE (old profile, old budget, recent expenses)
 * - Tania ANDRE      :   ACTIVE (old profile, recent budget)
 * - Eric DUVERS      : INACTIVE (old profile, old budget, old documents) - EXPECTED ARCHIVE DATE: IN 2 DAYS
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
          },
          budget: {
            create: {
              created: threeYearsBeforeNow,
              updated: threeYearsBeforeNow,
              incomes: {
                createMany: {
                  data: [
                    {
                      type: BudgetIncomeType.Beneficiary,
                      created: threeYearsBeforeNow,
                      updated: threeYearsBeforeNow
                    }
                  ]
                }
              }
            }
          }
        }
      }),
      FamilyFileRepo.prisma.create({
        data: {
          id: UUID_GRECO,
          structureId: fixtureStructures[0].id,
          referents: {
            connect: [
              { id: fixturesUsers[FixtureUserRole.StructureManager].id }
            ]
          },
          budget: {
            create: {
              created: threeYearsBeforeNow,
              updated: threeYearsBeforeNow,
              incomes: {
                createMany: {
                  data: [
                    {
                      type: BudgetIncomeType.Beneficiary,
                      created: threeYearsBeforeNow,
                      updated: threeYearsBeforeNow
                    },
                    {
                      type: BudgetIncomeType.Beneficiary,
                      created: twoDaysAgo,
                      updated: twoDaysAgo
                    }
                  ]
                }
              }
            }
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
          },
          budget: {
            create: {
              created: threeYearsBeforeNow,
              updated: threeYearsBeforeNow,
              expenses: {
                create: {
                  created: twoDaysAgo,
                  updated: twoDaysAgo
                }
              }
            }
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
          },
          budget: {
            create: {
              created: twoDaysAgo,
              updated: twoDaysAgo
            }
          }
        }
      }),
      FamilyFileRepo.prisma.create({
        data: {
          id: ID_ERIC_DUVERS,
          structureId: fixtureStructures[0].id,
          referents: {
            connect: [
              { id: fixturesUsers[FixtureUserRole.StructureManager].id }
            ]
          },
          budget: {
            create: {
              created: threeYearsBeforeNow,
              updated: threeYearsBeforeNow
            }
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
        updated: twoYearsBeforeNow
      }
    }),
    BeneficiaryRepo.prisma.create({
      data: {
        id: UUID_JANE,
        familyFileId: familyFileDoe.id,
        fileNumber: 'KEKEKEKEKE',
        structureId: fixtureStructures[0].id,
        status: 'Active',
        usualName: 'DOE',
        firstName: 'Jane',
        created: threeYearsBeforeNow,
        updated: threeYearsBeforeNow,
        socialSupports: {
          create: [
            {
              created: twoDaysAgo,
              updated: twoDaysAgo,
              createdById: fixturesUsers[FixtureUserRole.StructureManager].id,
              familyFileId: familyFileDoe.id,
              structureId: fixtureStructures[0].id,
              status: 'Accepted',
              socialSupportType: 'HelpRequest'
            },
            {
              created: twoYearsMinusTwoDaysBefore,
              updated: twoYearsMinusTwoDaysBefore,
              createdById: fixturesUsers[FixtureUserRole.StructureManager].id,
              familyFileId: familyFileDoe.id,
              structureId: fixtureStructures[0].id,
              status: 'Accepted',
              socialSupportType: 'Followup'
            }
          ]
        }
      }
    }),
    BeneficiaryRepo.prisma.create({
      data: {
        id: UUID_GRECO,
        familyFileId: familyFileGreco.id,
        fileNumber: 'LOLOLOLOLO',
        structureId: fixtureStructures[0].id,
        status: 'Active',
        usualName: 'GRECO',
        firstName: 'Lena',
        created: threeYearsBeforeNow,
        updated: threeYearsBeforeNow
      }
    }),
    BeneficiaryRepo.prisma.create({
      data: {
        id: UUID_DOC,
        familyFileId: familyFileDoe.id,
        fileNumber: 'DODODODODO',
        structureId: fixtureStructures[0].id,
        status: 'Active',
        usualName: 'DOCUMENT',
        firstName: 'Martine',
        created: threeYearsBeforeNow,
        updated: threeYearsBeforeNow,
        documents: {
          createMany: {
            data: [
              {
                type: DocumentType.Cerfa,
                created: twoDaysAgo,
                mimeType: 'pdf',
                name: 'myfile.pdf',
                filenameDisk: 'myfile.pdf',
                confidential: false,
                familyFileId: familyFileDoe.id,
                createdById: fixturesUsers[0].id
              }
            ]
          }
        }
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
        updated: threeYearsBeforeNow
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
        updated: threeYearsBeforeNow
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
        created: twoYearsMinusTwoDaysBefore,
        updated: twoYearsMinusTwoDaysBefore,
        documents: {
          createMany: {
            data: [
              {
                type: DocumentType.Cerfa,
                created: twoYearsMinusTwoDaysBefore,
                mimeType: 'pdf',
                name: 'myfile.pdf',
                filenameDisk: 'myfile.pdf',
                confidential: false,
                familyFileId: ffDuvers.id,
                createdById: fixturesUsers[0].id
              }
            ]
          }
        }
      }
    })
  ])
}

const deleteBeneficiary = async () => {
  await FamilyFileRepo.prisma.deleteMany({
    where: {
      id: {
        in: [
          ID_JOHN_DOE,
          UUID_GRECO,
          UUID_DOC,
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
  UUID_JANE,
  UUID_GRECO,
  UUID_DOC,
  ID_TONY_MARTIN,
  ID_TANIA_ANDRE,
  ID_ERIC_DUVERS,
  ID_TESSON,
  ID_INACTIVE,
  twoYearsBeforeNow
}
