import type {
  FollowupDuration,
  FollowupMedium,
  Prisma,
  SocialSupportStatus
} from '@prisma/client'
import { fakerFR as faker } from '@faker-js/faker'
import { equiRandomEnum } from './fixtures/utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole,
  fixturesSocialSupportSubjects,
  fixturesPartnerOrganizations,
  FixturePartnerOrganization
} from './fixtures'
import { prismaClient } from '~/server/prisma'

const STRUCTURE_ID = fixtureStructures[FixtureStructure.Test].id

const CREATOR_IDS = [
  fixturesUsers[FixtureUserRole.StructureManager].id,
  fixturesUsers[FixtureUserRole.Referent].id,
  fixturesUsers[FixtureUserRole.SocialWorker].id
]

const SUBJECT_IDS = [
  fixturesSocialSupportSubjects[0].id,
  fixturesSocialSupportSubjects[1].id,
  fixturesSocialSupportSubjects[2].id,
  fixturesSocialSupportSubjects[3].id,
  fixturesSocialSupportSubjects[4].id
]

const PARTNER_ORG_IDS = [
  fixturesPartnerOrganizations[FixturePartnerOrganization.CAF26].id,
  fixturesPartnerOrganizations[FixturePartnerOrganization.FranceTravail].id,
  fixturesPartnerOrganizations[FixturePartnerOrganization.MairieValence].id
]

const BENEFICIARY_COUNT = 1000
const FOLLOWUPS_PER_BENEFICIARY = 20
const CHUNK_SIZE = 100

const DATE_FROM = new Date('2025-11-21')
const DATE_TO = new Date('2026-05-21')

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

function randomStatus(): SocialSupportStatus {
  return equiRandomEnum(['Todo', 'InProgress', 'Done'])
}

function randomDuration(): FollowupDuration | null {
  return equiRandomEnum([
    null,
    'Quarter',
    'Half',
    'ThreeQuarter',
    'Hour',
    'MoreThanHour'
  ])
}

function randomCreator(): string {
  return equiRandomEnum(CREATOR_IDS)
}

function randomSubjectIds(): string[] {
  const count = faker.number.int({ min: 1, max: 2 })
  const shuffled = faker.helpers.shuffle([...SUBJECT_IDS])
  return shuffled.slice(0, count)
}

function randomBoolean(): boolean | null {
  return equiRandomEnum([null, true, false])
}

async function main() {
  console.log(
    `Creating ${BENEFICIARY_COUNT} beneficiaries with ${FOLLOWUPS_PER_BENEFICIARY} followups each (${BENEFICIARY_COUNT * FOLLOWUPS_PER_BENEFICIARY} total)...`
  )

  for (let chunk = 0; chunk < BENEFICIARY_COUNT / CHUNK_SIZE; chunk++) {
    const offset = chunk * CHUNK_SIZE
    const count = Math.min(CHUNK_SIZE, BENEFICIARY_COUNT - offset)
    console.log(
      `Chunk ${chunk + 1}/${Math.ceil(BENEFICIARY_COUNT / CHUNK_SIZE)}: beneficiaries ${offset + 1}-${offset + count}`
    )

    const families = await prismaClient.familyFile.createManyAndReturn({
      data: Array.from({ length: count }, () => ({
        structureId: STRUCTURE_ID
      }))
    })

    await prismaClient.budget.createMany({
      data: families.map(({ id }) => ({ familyFileId: id }))
    })

    const beneficiaries = await prismaClient.beneficiary.createManyAndReturn({
      select: { id: true, familyFileId: true },
      data: families.map(({ id }) => ({
        firstName: faker.person.firstName(),
        birthName: faker.person.lastName(),
        usualName: faker.person.lastName(),
        birthDate: faker.date.birthdate(),
        gender: equiRandomEnum(['Male', 'Female', 'Other'] as const),
        structureId: STRUCTURE_ID,
        fileNumber: faker.string.ulid(),
        status: equiRandomEnum([
          'Active',
          'Active',
          'Active',
          'Inactive'
        ] as const),
        familyFileId: id,
        zipcode: faker.location.zipCode(),
        city: faker.location.city(),
        street: faker.location.streetAddress(),
        region: faker.location.state(),
        phone1: faker.phone.number(),
        email: faker.internet.email(),
        mobility: equiRandomEnum([
          'PermitWithVehicle',
          'PublicTransport',
          'BikeOrEquivalent',
          'None'
        ] as const)
      }))
    })

    const socialSupportData: Prisma.SocialSupportCreateManyInput[] =
      beneficiaries.flatMap(b =>
        Array.from({ length: FOLLOWUPS_PER_BENEFICIARY }, () => {
          const medium = randomMedium()
          return {
            createdById: randomCreator(),
            lastUpdatedById: randomCreator(),
            beneficiaryId: b.id,
            familyFileId: b.familyFileId,
            socialSupportType: 'Followup' as const,
            structureId: STRUCTURE_ID,
            status: randomStatus(),
            subtype: medium,
            date: faker.date.between({ from: DATE_FROM, to: DATE_TO }),
            synthesis: faker.helpers.maybe(() => faker.lorem.sentences(2), {
              probability: 0.6
            }),
            synthesisRichText: faker.helpers.maybe(
              () => `<p>${faker.lorem.sentences(2)}</p>`,
              { probability: 0.4 }
            )
          }
        })
      )

    const supports = await prismaClient.socialSupport.createManyAndReturn({
      select: { id: true, subtype: true },
      data: socialSupportData
    })

    await prismaClient.followup.createMany({
      data: supports.map(({ id, subtype }) => {
        const duration = randomDuration()
        return {
          socialSupportId: id,
          medium: (subtype as FollowupMedium) || 'PhoneCall',
          helpRequested: randomBoolean() as boolean | null,
          classified: randomBoolean() as boolean | null,
          firstFollowup: randomBoolean() as boolean | null,
          forwardedToJustice: randomBoolean() as boolean | null,
          place: faker.helpers.maybe(() => faker.location.city(), {
            probability: 0.3
          }),
          thirdPersonName: faker.helpers.maybe(() => faker.person.fullName(), {
            probability: 0.1
          }),
          ...(duration && { duration })
        }
      })
    })

    const redirectionData: Prisma.SocialSupportRedirectionCreateManyInput[] = []
    for (const { id } of supports) {
      if (faker.datatype.boolean(0.4)) {
        const type = equiRandomEnum([
          'PartnerOrganization',
          'Intern',
          'Other'
        ] as const)
        redirectionData.push({
          socialSupportId: id,
          type,
          motif: faker.helpers.maybe(() => faker.word.words(3), {
            probability: 0.5
          }),
          ...(type === 'PartnerOrganization' && {
            partnerOrganizationId: equiRandomEnum(PARTNER_ORG_IDS)
          })
        })
      }
    }
    if (redirectionData.length > 0) {
      await prismaClient.socialSupportRedirection.createMany({
        data: redirectionData
      })
    }

    const subjectUpdates = supports.map(({ id }) =>
      prismaClient.socialSupport.update({
        where: { id },
        data: {
          subjects: { connect: randomSubjectIds().map(sid => ({ id: sid })) }
        }
      })
    )
    const txBatchSize = 500
    for (let i = 0; i < subjectUpdates.length; i += txBatchSize) {
      await prismaClient.$transaction(subjectUpdates.slice(i, i + txBatchSize))
    }

    console.log(
      `  -> ${count} beneficiaries, ${supports.length} followups, ${redirectionData.length} redirections`
    )
  }

  const total = await prismaClient.socialSupport.count({
    where: { structureId: STRUCTURE_ID, socialSupportType: 'Followup' }
  })
  console.log(`Done. Total followups in structure: ${total}`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prismaClient.$disconnect())
