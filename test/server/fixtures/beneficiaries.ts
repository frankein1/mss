import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { prismaClient } from '~/server/prisma'

const defaultStructureId = fixtureStructures[FixtureStructure.Test].id
const defaultReferentId = fixturesUsers[FixtureUserRole.Referent].id

export async function createBeneficiary(
  date: Date,
  familyFileId: string,
  structureId = defaultStructureId,
  referentId = defaultReferentId,
  fileNumber = '87MB42GCB5'
) {
  return await prismaClient.beneficiary.create({
    select: {
      id: true,
      fileNumber: true,
      relatives: {
        select: {
          id: true
        }
      },
      documents: {
        select: {
          key: true,
          documentContent: {
            select: {
              id: true
            }
          }
        }
      }
    },
    data: {
      created: date,
      updated: date,
      familyFile: {
        connect: { id: familyFileId }
      },
      structure: {
        connect: { id: structureId }
      },
      createdBy: {
        connect: { id: referentId }
      },
      aidantConnectAuthorized: true,
      fileNumber,
      status: 'Deceased',
      title: 'Miss',
      usualName: 'Attaque',
      birthName: 'Biron',
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
            lastName: 'Attaque',
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
            lastName: 'attaque',
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
            lastName: 'ATtaque',
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
      },
      documents: {
        create: [
          {
            created: date,
            familyFileId,
            createdById: referentId,
            mimeType: 'application/pdf',
            name: 'certificat.pdf',
            filenameDisk: 'random-id',
            filenameDownload: 'certificat.pdf',
            type: 'Justificatifs',
            tags: ['CertificatDeNaissance'],
            confidential: true,
            documentContent: {
              create: {
                content: Buffer.from('testcontent')
              }
            }
          }
        ]
      }
    }
  })
}
