import { BeneficiaryStatus, PrismaClient } from '@prisma/client'
import { fakerFR as faker } from '@faker-js/faker'
import { ArrayElement } from '~/types/utils'

const prismaClient = new PrismaClient()
const STRUCTURE_COUNT = 200
const FAMILY_FILE_PER_STRUCTURE_COUNT = 1000

type SocialSupportSubjectsCreateInput = Omit<
  ArrayElement<
    NonNullable<
      Parameters<typeof prismaClient.socialSupportSubject.createMany>[0]
    >['data']
  >,
  'ownedByStructureId'
>

const ID_JEANNE_RESPONSABLE = '7e5c1734-35cb-4047-9035-a944961a67a4'
const ID_JEANNE_REFERENTE = 'ddd586d1-d747-4a54-896d-3e7cf90ea91f'

const socialSupportSubjects: SocialSupportSubjectsCreateInput[] = [
  {
    name: 'Inclusion numérique',
    default: 'InclusionNumerique',
    used: true
  },
  {
    name: 'Domiciliation',
    default: 'Domiciliation',
    used: true
  },
  {
    name: 'Aide sociale',
    default: 'AideSociale',
    used: true
  },
  {
    name: 'Aides financières non remboursables',
    used: true
  }
]

function randomStatus(): BeneficiaryStatus {
  const int = faker.number.int({ min: 0, max: 10 })
  if (int === 0) {
    return 'Archived'
  }
  if (int === 1) {
    return 'Deceased'
  }
  if (int === 2 || int === 3) {
    return 'Inactive'
  }
  return 'Active'
}

async function main() {
  for (let i = 0; i < STRUCTURE_COUNT; i++) {
    console.log('starting seed', i)
    const structure = await prismaClient.structure.create({
      data: {
        type: 'Ccas',
        name: faker.company.name(),
        zipcode: faker.location.zipCode(),
        city: faker.location.city(),
        address: faker.location.streetAddress(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        socialSupportSubjects: { createMany: { data: socialSupportSubjects } }
      }
    })

    if (i === 0) {
      console.log('Linking Jeanne Responsable to a structure...')
      await prismaClient.user.updateMany({
        data: { structureId: structure.id },
        where: { id: { in: [ID_JEANNE_RESPONSABLE, ID_JEANNE_REFERENTE] } }
      })
    }

    const families = await prismaClient.familyFile.createManyAndReturn({
      data: new Array(FAMILY_FILE_PER_STRUCTURE_COUNT).fill(null).map(() => ({
        structureId: structure.id
      }))
    })

    if (i === 0) {
      console.log('Marking Jeanne Referente as referent to families...')
      await prismaClient.user.update({
        data: {
          referentFor: { connect: families }
        },
        where: { id: ID_JEANNE_REFERENTE }
      })
    }

    await Promise.all([
      prismaClient.budget.createMany({
        data: families.map(({ id }) => ({
          familyFileId: id
        }))
      }),
      prismaClient.beneficiary.createMany({
        data: families.map(({ id }) => ({
          firstName: faker.person.firstName(),
          birthName: faker.person.lastName(),
          usualName: faker.person.lastName(),
          birthDate: faker.date.birthdate(),
          structureId: structure.id,
          fileNumber: faker.string.ulid(),
          status: randomStatus(),
          familyFileId: id,
          zipcode: faker.location.zipCode(),
          city: faker.location.city(),
          street: faker.location.streetAddress(),
          phone1: faker.phone.number(),
          email: faker.internet.email()
        }))
      }),
      prismaClient.user.update({
        where: { id: ID_JEANNE_RESPONSABLE },
        data: {
          referentFor: { connect: families }
        }
      })
    ])
  }
}

main()
