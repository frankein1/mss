import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~~/prisma/fixtures'
import { prismaClient } from '~~/server/prisma'

const defaultStructureId = fixtureStructures[FixtureStructure.Test].id
const defaultReferentId = fixturesUsers[FixtureUserRole.Referent].id
const defaultStructureManagerId =
  fixturesUsers[FixtureUserRole.StructureManager].id

export async function createFamilyFile(
  date: Date,
  structureId: string = defaultStructureId,
  referentId: string = defaultReferentId,
  structureManagerId: string = defaultStructureManagerId
) {
  return await prismaClient.familyFile.create({
    data: {
      structure: {
        connect: { id: structureId }
      },
      referents: {
        connect: [{ id: structureManagerId }, { id: referentId }]
      },
      budget: {
        create: {
          created: date,
          updated: date,
          numberHouseholdMembers: 3,
          savings: 55241,
          overdraft: 324,
          familyQuotient: 2,
          banqueDeFrance: 0,
          expenses: {
            create: {
              rent: 1356,
              expenses: 285,
              water: 20,
              electricity: 74,
              gas: 43,
              fuelOrOther: 0,
              housingTax: 0,
              propertyTax: 140,
              incomeTax: 156,
              carInsurance: 46,
              homeInsurance: 35,
              deathInsurance: 19,
              retirementInsurance: 85,
              otherInsurance: 0,
              remittedAlimony: 0,
              healthInsurance: 50,
              phoneInternet: 30,
              schoolFees: 200,
              schoolCanteen: 120,
              other: 0,
              loans: {
                create: [
                  {
                    created: date,
                    updated: date,
                    type: 'Crédit consommation Crédit Agricole',
                    amountTotal: '18000',
                    amountPerMonth: '110',
                    dueDate: new Date('2028-01-14')
                  },
                  {
                    created: date,
                    updated: date,
                    type: 'Prêt travaux',
                    amountTotal: '48000',
                    amountPerMonth: '400',
                    dueDate: new Date('2036-02-24')
                  }
                ]
              },
              debts: {
                create: [
                  {
                    created: date,
                    updated: date,
                    type: 'Casino',
                    amountTotal: 10000,
                    amountPerMonth: 100,
                    dueDate: new Date('2024-06-20')
                  },
                  {
                    created: date,
                    updated: date,
                    type: 'Remboursement prêt familial',
                    amountTotal: 5000,
                    amountPerMonth: 100,
                    dueDate: null
                  }
                ]
              },
              customs: {
                create: [
                  {
                    created: date,
                    updated: date,
                    type: 'Contrat Enedis',
                    amount: 100
                  }
                ]
              }
            }
          },
          incomes: {
            create: [
              {
                created: date,
                updated: date,
                salary: 6350,
                primeActivite: 0,
                retirement: 0,
                alimony: 200,
                disability: 0,
                unemployment: 0,
                ass: 0,
                rsa: 0,
                apl: 0,
                family: 250,
                aah: 0,
                aspa: 0,
                dailyAllowance: 0,
                annuity: 100,
                other: 485,
                type: 'Beneficiary',
                lastName: null,
                firstName: null,
                relationship: null,
                customs: {
                  create: [
                    {
                      created: date,
                      updated: date,
                      type: 'Allocation PAJE',
                      amount: 50
                    },
                    {
                      created: date,
                      updated: date,
                      type: 'Pension de réversion',
                      amount: 1200
                    }
                  ]
                }
              },
              {
                created: date,
                updated: date,
                salary: 0,
                primeActivite: 100,
                retirement: 0,
                alimony: 0,
                disability: 0,
                unemployment: 0,
                ass: 0,
                rsa: 550,
                apl: 0,
                family: 250,
                aah: 0,
                aspa: 0,
                dailyAllowance: 0,
                annuity: 0,
                other: 0,
                type: 'HouseholdMember',
                lastName: 'ATTAQUE',
                firstName: 'Henri',
                relationship: 'Sibling'
              }
            ]
          }
        }
      }
    }
  })
}
