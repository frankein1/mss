import { prismaClient } from '~/server/prisma'

export enum TestFixtureUsers {
  Referent = 0,
  StructureManager = 1
}

export enum TestFixtureSocialSupportSubjects {
  SingleParent = 0,
  FinancialUrgency = 1
}

export enum TestFixturePartnerOrganizations {
  FranceTravail = 0
}

const select = {
  id: true,
  createdSocialSupportSubjects: {
    select: {
      id: true
    }
  },
  createdPartnerOrganizations: {
    select: {
      id: true,
      contacts: {
        select: {
          id: true
        }
      }
    }
  },
  accounts: {
    select: {
      id: true
    }
  }
}

export async function createUsers(date: Date, structureId: string) {
  const userReferent = prismaClient.user.create({
    select,
    data: {
      created: date,
      updated: date,
      structureId,
      firstName: 'Antoine',
      lastName: 'Référent',
      email: 'antoine.referent@yopmail.com',
      role: 'Referent',
      status: 'Active',
      aidantConnectAuthorisation: true,
      firstAccess: date,
      lastAccess: date,
      externalRdvspId: null,
      createdSocialSupportSubjects: {
        create: [
          {
            created: date,
            name: 'Aide aux familles monoparentales',
            default: null,
            used: true,
            ownedByStructureId: structureId
          },
          {
            created: date,
            name: "Aide financière d'urgence",
            default: null,
            used: true,
            ownedByStructureId: structureId
          }
        ]
      },
      createdPartnerOrganizations: {
        create: [
          {
            created: date,
            structureId,
            name: 'Antenne France Travail de Lyon',
            siret: '89723241265721',
            address: '7 Rue Abraham Bloch',
            city: 'Lyon',
            zipcode: '69007',
            phone1: '06 06 06 06 06',
            phone2: '06 02 05 04 03',
            email: 'antenne-france-travail-lyon@example.com',
            workingHours: 'Lundi au Vendredi de 9h à 17h30',
            inactive: false,
            contacts: {
              create: {
                name: 'Fabrice Darrieux',
                email: 'fabrice.darrieux@example.com',
                phone: '06 45 65 25 98'
              }
            }
          }
        ]
      },
      accounts: {
        createMany: {
          data: [
            {
              provider: 'proconnect',
              type: 'internal',
              providerAccountId: 'random-account-id',
              accessToken: 'random-token-value'
            }
          ]
        }
      }
    }
  })

  const userStructureManager = prismaClient.user.create({
    select,
    data: {
      created: date,
      updated: date,
      structureId,
      firstName: 'Amalia',
      lastName: 'Responsable de structure',
      email: 'amalia.responsable@yopmail.com',
      role: 'StructureManager',
      status: 'Active',
      aidantConnectAuthorisation: true,
      firstAccess: date,
      lastAccess: date,
      accounts: {
        createMany: {
          data: [
            {
              provider: 'proconnect',
              type: 'internal',
              providerAccountId: 'other-random-account-id',
              accessToken: 'other-random-token-value'
            }
          ]
        }
      }
    }
  })

  return await Promise.all([userReferent, userStructureManager])
}
