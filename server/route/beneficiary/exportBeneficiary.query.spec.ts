import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { expect, afterEach, beforeEach } from 'vitest'
import { test } from '~/test/server/test-utils'
import { prismaClient } from '~/server/prisma'
import { TextWriter, ZipReader, BlobReader } from '@zip.js/zip.js'
import { readFileSync } from 'fs'
import { formatDate } from '~/utils/formatDate'

let familyFileId: string
let beneficiaryId: string

beforeEach(async () => {
  const date = new Date('2020-11-25')
  const file = await createFamilyFile(date)
  familyFileId = file.id
  const ben = await createBeneficiary(date, familyFileId)

  beneficiaryId = ben.id
})

afterEach(async () => await resetDatabase(familyFileId, beneficiaryId))

test('Beneficiary - Archive - Structure Manager should be able to export complete beneficiary data', async ({
  trpc
}) => {
  const { archiveFile } =
    await trpc.structureManager.beneficiary.exportBeneficiary({
      beneficiaryId,
      keepName: true
    })

  const filecontents = await readZippedArchive(archiveFile)
  const dir = './test/server/references/beneficiary-export/'

  const summary = readFileSync(`${dir}Résumé_archive.html`)
    .toString()
    .replace('XX/XX/XXXX', formatDate(new Date()))

  expect(filecontents['Résumé_archive.html']).toBe(summary)

  const beneficiaryInfo = readFileSync(
    `${dir}Informations/Louise ATTAQUE.html`
  ).toString()

  expect(filecontents['Informations/Louise ATTAQUE.html']).toBe(beneficiaryInfo)
})

/** Unzip archive and set file contents in an object indexed by their file name */
async function readZippedArchive(dataurl: string) {
  const res = await fetch(dataurl)
  const reader = new BlobReader(await res.blob())
  const zipReader = new ZipReader(reader)
  const entries = await zipReader.getEntries()

  const filecontents: Record<string, string> = {}
  for (const entry of entries) {
    if (entry.directory) {
      continue
    }
    if (!entry.getData) {
      continue
    }
    const writer = new TextWriter()
    const content = await entry.getData(writer)
    filecontents[entry.filename] = content
  }

  return filecontents
}

const _convertHtmlToText = (html: string) =>
  html.replace(/<style.*?<\/style>/gs, '').replace(/<[^>]*>/g, '')

async function resetDatabase(fid: string, bid: string) {
  if (bid) {
    await prismaClient.beneficiary.delete({ where: { id: bid } })
  }
  if (fid) {
    await prismaClient.familyFile.delete({ where: { id: fid } })
  }
}

async function createFamilyFile(date: Date) {
  return await prismaClient.familyFile.create({
    data: {
      structure: {
        connect: { id: fixtureStructures[FixtureStructure.Test].id }
      },
      referents: {
        connect: [
          { id: fixturesUsers[FixtureUserRole.StructureManager].id },
          { id: fixturesUsers[FixtureUserRole.Referent].id }
        ]
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

async function createBeneficiary(date: Date, familyFileId: string) {
  return await prismaClient.beneficiary.create({
    data: {
      created: date,
      updated: date,
      familyFile: {
        connect: { id: familyFileId }
      },
      structure: {
        connect: { id: fixtureStructures[FixtureStructure.Test].id }
      },
      createdBy: {
        connect: { id: fixturesUsers[FixtureUserRole.Referent].id }
      },
      draft: false,
      aidantConnectAuthorized: true,
      fileNumber: '87MB42GCB5',
      status: 'Deceased',
      title: 'Miss',
      usualName: 'ATTAQUE',
      birthName: 'BIRON',
      firstName: 'Louise',
      birthDate: new Date('1985-12-14'),
      birthPlace: null,
      deathDate: new Date('2023-11-10'),
      gender: 'Female',
      nationality: 'FRA',
      accommodationMode: 'SocialRenting',
      accommodationName: 'SOLIHA',
      accommodationAdditionalInformation:
        'Hébergée chez un membre de la famille',
      street: '12 rue Monge',
      addressComplement: null,
      zipcode: '69330',
      city: 'Meyzieu',
      department: 'Rhône',
      region: 'Auvergne-Rhône-Alpes',
      qpv: true,
      noPhone: false,
      phone1: '06 50 28 91 27',
      phone2: '01 42 15 48 65',
      email: 'louise.attaque@example.fr',
      familySituation: 'Widow',
      weddingDate: new Date('2011-05-26'),
      divorceDate: null,
      caregiver: true,
      minorChildren: 2,
      majorChildren: 0,
      mobility: 'PublicTransport',
      vulnerablePerson: true,
      relationship: null,
      ministereCategorie: 'CategorieA',
      ministereDepartementServiceAc: 'Rhone69',
      ministereStructure: 'AdministrationCentrale',
      gir: 'Level4',
      doctor: 'Docteur Untel',
      healthAdditionalInformation:
        'Infos complémentaires de santé confidentielles',
      socialSecurityNumber: '1 91 12 91 256 254 65',
      insurance: 'Ma mutuelle',
      socioProfessionalCategory: 'Employed',
      studyLevel: 'BacPlus2',
      occupation:
        "Attachée d'administration (En congé d'affection longue durée)",
      employer: 'Etat',
      employerSiret: '123654889547',
      unemploymentNumber: null,
      pensionOrganisations: ['AgircArrco'],
      otherPensionOrganisations: 'Complémentaire Fontionnaire',
      cafNumber: '123654',
      bank: 'La Banque Populaire',
      funeralContract: 'Pompes funêbres Bouillane',
      protectionMeasure: 'CuratelleRenforcee',
      representative: 'Parent',
      prescribingStructure: 'CAF de Lyon 6',
      orientationType: 'Departement',
      orientationStructure: 'CCAS de Lyon 6',
      serviceProviders: null,
      involvedPartners: "Service d'assistance de son département de travail",
      additionalInformation: null,
      numeroPegase: '12547AD54',
      accommodationZone: 'France',
      relatives: {
        create: [
          {
            created: date,
            updated: date,
            lastName: 'ATTAQUE',
            firstName: 'Elia',
            relationship: 'EnfantMineur',
            city: 'Lyon',
            email: 'elia@example.com',
            phone: '06 54 84 56 21',
            hosted: true,
            caregiver: false,
            additionalInformation: "Information sur l'enfant Elia",
            birthDate: new Date('2019-01-05')
          },
          {
            created: date,
            updated: date,
            lastName: 'ATTAQUE',
            firstName: 'Hugues',
            relationship: 'EnfantMineur',
            city: 'Lyon',
            email: 'hugo@example.com',
            phone: '06 34 18 56 72',
            hosted: true,
            caregiver: false,
            additionalInformation: "Information sur l'enfant Hugues",
            birthDate: new Date('2015-10-15')
          },
          {
            created: date,
            updated: date,
            lastName: 'ATTAQUE',
            firstName: 'Henri',
            relationship: 'Sibling',
            city: 'Lyon',
            email: 'henriattaque@example.com',
            phone: '02 01 45 89 67',
            hosted: true,
            caregiver: true,
            additionalInformation: 'Frère habitant le domicile',
            birthDate: new Date('1984-09-23')
          }
        ]
      }
    }
  })
}
