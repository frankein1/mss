import { prismaClient } from '~/server/prisma'
import { beforeAll, afterAll, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole,
  fixturesBeneficiaries
} from '~/prisma/fixtures'
import { faker } from '@faker-js/faker'
import { WorkshopAttendeeType } from '@prisma/client'

let workshopIds: string[]

const createWorkshopWithAttendees = async () => {
  const createdById = fixturesUsers[FixtureUserRole.StructureManager].id
  const structureId = fixtureStructures[FixtureStructure.Test].id

  const workshopNoLimit = await prismaClient.workshop.create({
    select: { id: true },
    data: {
      date: new Date(),
      createdBy: { connect: { id: createdById } },
      structure: { connect: { id: structureId } },
      workshopName: {
        create: {
          name: faker.lorem.words(),
          structureId,
          createdById
        }
      },
      workshopAttendees: {
        create: [
          {
            type: WorkshopAttendeeType.Beneficiary,
            listType: 'Main',
            comment: 'beneficiary',
            beneficiary: { connect: { id: fixturesBeneficiaries[0].id } }
          },
          {
            type: WorkshopAttendeeType.Beneficiary,
            listType: 'Main',
            comment: 'beneficiary',
            beneficiary: { connect: { id: fixturesBeneficiaries[1].id } }
          },
          {
            type: WorkshopAttendeeType.Beneficiary,
            listType: 'Main',
            comment: 'beneficiary',
            beneficiary: { connect: { id: fixturesBeneficiaries[2].id } }
          }
        ]
      }
    }
  })
  const workshopLimitTree = await prismaClient.workshop.create({
    select: { id: true },
    data: {
      date: new Date(),
      createdBy: { connect: { id: createdById } },
      structure: { connect: { id: structureId } },
      attendeeLimit: 3,
      workshopName: {
        create: {
          name: faker.lorem.words(),
          structureId,
          createdById
        }
      },
      workshopAttendees: {
        create: [
          {
            type: WorkshopAttendeeType.Beneficiary,
            listType: 'Main',
            comment: 'beneficiary',
            beneficiary: { connect: { id: fixturesBeneficiaries[0].id } }
          },
          {
            type: WorkshopAttendeeType.Beneficiary,
            listType: 'Main',
            comment: 'beneficiary',
            beneficiary: { connect: { id: fixturesBeneficiaries[1].id } }
          }
        ]
      }
    }
  })

  const workshopLimitFive = await prismaClient.workshop.create({
    select: { id: true },
    data: {
      date: new Date(),
      createdBy: { connect: { id: createdById } },
      structure: { connect: { id: structureId } },
      attendeeLimit: 5,
      workshopName: {
        create: {
          name: faker.lorem.words(),
          structureId,
          createdById
        }
      },
      workshopAttendees: {
        create: [
          {
            type: WorkshopAttendeeType.Beneficiary,
            listType: 'Main',
            comment: 'beneficiary',
            beneficiary: { connect: { id: fixturesBeneficiaries[3].id } }
          },
          {
            type: WorkshopAttendeeType.Beneficiary,
            listType: 'Main',
            comment: 'beneficiary',
            beneficiary: { connect: { id: fixturesBeneficiaries[4].id } }
          }
        ]
      }
    }
  })

  return [workshopNoLimit, workshopLimitTree, workshopLimitFive]
}

beforeAll(async () => {
  const workshops = await createWorkshopWithAttendees()
  workshopIds = workshops.map(w => w.id)
})

afterAll(async () => {
  await resetDatabase(workshopIds)
})

test('Workshop without attendee limits - Register Beneficiaries - All new attendees are Main type', async ({
  trpc
}) => {
  const attendees = await trpc.structureManager.workshop.registerBeneficiaries({
    workshopIds: [workshopIds[0] as string],
    beneficiaryIds: [fixturesBeneficiaries[4].id, fixturesBeneficiaries[5].id]
  })
  expect(attendees.filter(a => a.listType === 'Main')).toHaveLength(2)
})

test('Workshop with attendee limits - Excess attendees must be Waiting type', async ({
  trpc
}) => {
  const attendees = await trpc.structureManager.workshop.registerBeneficiaries({
    workshopIds: [workshopIds[1] as string],
    beneficiaryIds: [
      fixturesBeneficiaries[4].id,
      fixturesBeneficiaries[5].id,
      fixturesBeneficiaries[6].id
    ]
  })
  expect(attendees.filter(a => a.listType === 'Main')).toHaveLength(1)
  expect(attendees.filter(a => a.listType === 'Waiting')).toHaveLength(2)
})

test('Workshop with attendee limits - Attendees inside boundaries must be Main type', async ({
  trpc
}) => {
  const attendees = await trpc.structureManager.workshop.registerBeneficiaries({
    workshopIds: [workshopIds[2] as string],
    beneficiaryIds: [fixturesBeneficiaries[5].id, fixturesBeneficiaries[6].id]
  })
  expect(attendees.filter(a => a.listType === 'Main')).toHaveLength(2)
  expect(attendees.filter(a => a.listType === 'Waiting')).toHaveLength(0)
})

const resetDatabase = async (workshopIds: string[]) => {
  await prismaClient.workshop.deleteMany({
    where: {
      id: {
        in: workshopIds
      }
    }
  })
  await prismaClient.workshopAttendee.deleteMany({
    where: {
      workshopId: {
        in: workshopIds
      }
    }
  })
  await prismaClient.workshopName.deleteMany({
    where: {
      workshops: {
        every: {
          id: {
            in: workshopIds
          }
        }
      }
    }
  })
}
