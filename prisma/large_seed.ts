import type {
  BeneficiaryMobility,
  BeneficiaryStatus,
  FollowupMedium,
  Gender,
  Prisma,
  SocialSupportStatus
} from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import { fakerFR as faker } from '@faker-js/faker'
import type { ArrayElement } from '~/types/utils'
import { equiRandomEnum } from './fixtures/utils'

const prismaClient = new PrismaClient()
const STRUCTURE_COUNT = 200
// if USERS_PER_STRUCTURE is null use Jeanne Responsable
const USERS_PER_STRUCTURE: number | null = null
const FAMILY_FILE_PER_STRUCTURE_COUNT = 1000
// if SOCIAL_SUPPORTS_PER_STRUCTURE is null do not create social supports
const SOCIAL_SUPPORTS_PER_BENEFICIARY: number | null = 15

type SocialSupportSubjectsCreateInput = Omit<
  ArrayElement<
    NonNullable<
      Parameters<typeof prismaClient.socialSupportSubject.createMany>[0]
    >['data']
  >,
  'ownedByStructureId'
>

const ID_JEANNE_RESPONSABLE = '7e5c1734-35cb-4047-9035-a944961a67a4'

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
  return equiRandomEnum([
    'Archived',
    'Deceased',
    'Inactive',
    'Inactive',
    'Active'
  ])
}
function randomGender(): Gender {
  return equiRandomEnum(['Male', 'Female', 'Other'])
}
function randomMobility(): BeneficiaryMobility {
  return equiRandomEnum([
    'PermitWithVehicle',
    'PermitWithoutVehicle',
    'Code',
    'PermitPending',
    'OtherPermit',
    'PublicTransport',
    'BikeOrEquivalent',
    'InvalidPermit',
    'VehicleWithoutPermit',
    'None'
  ])
}
function randomMedium(): FollowupMedium {
  return equiRandomEnum([
    'PlannedInPerson',
    'UnplannedInPerson',
    'PhoneCall',
    'BeneficiaryHouseAppointment',
    'ExternalAppointment',
    'PostalMail',
    'Email',
    'Videoconference',
    'ThirdParty'
  ])
}
function randomFollowupStatus(): SocialSupportStatus {
  return equiRandomEnum(['Todo', 'InProgress', 'Done'])
}

async function main() {
  for (let i = 0; i < STRUCTURE_COUNT; i++) {
    console.log('starting seed', `${i}/${STRUCTURE_COUNT}`)
    const structure = await prismaClient.structure.create({
      data: {
        type: 'Ccas',
        name: faker.company.name(),
        zipcode: faker.location.zipCode(),
        siret: '12345678901234',
        city: faker.location.city(),
        address: faker.location.streetAddress(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        socialSupportSubjects: { createMany: { data: socialSupportSubjects } }
      }
    })

    let users: { id: string }[] = []

    if (USERS_PER_STRUCTURE === null) {
      if (i === 0) {
        console.log('Linking Jeanne Responsable to a structure...')
        await prismaClient.user.update({
          data: { structureId: structure.id },
          where: { id: ID_JEANNE_RESPONSABLE }
        })
      }
    } else {
      const data = new Array(USERS_PER_STRUCTURE).fill(null).map(() => {
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()
        const email = `${faker.string.ulid()}${faker.internet.email({
          firstName,
          lastName,
          allowSpecialCharacters: true
        })}`
        return {
          structureId: structure.id,
          firstName,
          lastName,
          email,
          role: 'Referent' as const,
          status: 'Active' as const,
          lastAccess: faker.date.between({ from: '2022-01-01', to: new Date() })
        } satisfies Prisma.UserCreateManyInput
      })

      users = await prismaClient.user.createManyAndReturn({
        select: { id: true },
        data
      })
    }

    const families = await prismaClient.familyFile.createManyAndReturn({
      data: new Array(FAMILY_FILE_PER_STRUCTURE_COUNT).fill(null).map(() => ({
        structureId: structure.id
      }))
    })

    const [_, beneficiaries, __] = await Promise.all([
      prismaClient.budget.createMany({
        data: families.map(({ id }) => ({
          familyFileId: id
        }))
      }),
      prismaClient.beneficiary.createManyAndReturn({
        select: { id: true, familyFileId: true },
        data: families.map(({ id }) => ({
          firstName: faker.person.firstName(),
          birthName: faker.person.lastName(),
          usualName: faker.person.lastName(),
          birthDate: faker.date.birthdate(),
          gender: randomGender(),
          structureId: structure.id,
          fileNumber: faker.string.ulid(),
          status: randomStatus(),
          familyFileId: id,
          zipcode: faker.location.zipCode(),
          city: faker.location.city(),
          street: faker.location.streetAddress(),
          region: faker.location.state(),
          phone1: faker.phone.number(),
          email: faker.internet.email(),
          mobility: randomMobility()
        }))
      }),
      prismaClient.user.update({
        where: { id: users[0]?.id || ID_JEANNE_RESPONSABLE },
        data: {
          referentFor: { connect: families }
        }
      })
    ])

    if (SOCIAL_SUPPORTS_PER_BENEFICIARY !== null) {
      // data contains FAMILY_FILE_PER_STRUCTURE_COUNT * SOCIAL_SUPPORTS_PER_BENEFICIARY items
      const data: Prisma.SocialSupportCreateManyInput[] = beneficiaries.flatMap(
        beneficiary =>
          new Array(SOCIAL_SUPPORTS_PER_BENEFICIARY).fill(null).map(() => ({
            createdById: users[0]?.id || ID_JEANNE_RESPONSABLE,
            lastUpdatedById: users[0]?.id || ID_JEANNE_RESPONSABLE,
            beneficiaryId: beneficiary.id,
            familyFileId: beneficiary.familyFileId,
            socialSupportType: 'Followup' as const,
            structureId: structure.id,
            status: randomFollowupStatus(),
            subtype: randomMedium(),
            date: faker.date.between({ from: '2022-01-01', to: new Date() })
          }))
      )

      const supports = await prismaClient.socialSupport.createManyAndReturn({
        select: { id: true },
        data
      })

      await Promise.all([
        prismaClient.followup.createMany({
          data: supports.map(({ id }) => ({
            socialSupportId: id,
            medium: randomMedium()
          }))
        }),
        prismaClient.socialSupportSubject.update({
          where: {
            ownedByStructureId_name: {
              name: socialSupportSubjects[0]?.name as string,
              ownedByStructureId: structure.id
            }
          },
          data: { socialSupports: { connect: supports } }
        })
      ])
    }
  }
}

main()
