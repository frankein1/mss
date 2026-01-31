import { prismaClient } from '~/server/prisma'
import { afterEach, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { formatDate } from '~/utils/formatDate'
import { faker } from '@faker-js/faker'

const workshopIds: string[] = []

// Create a workshop factory with optional attendee limit
const createWorkshop = async (attendeeLimit?: number) => {
  const createdById = fixturesUsers[FixtureUserRole.StructureManager].id
  const structureId = fixtureStructures[FixtureStructure.Test].id

  const workshop = await prismaClient.workshop.create({
    select: { id: true },
    data: {
      date: new Date(),
      attendeeLimit,
      createdBy: { connect: { id: createdById } },
      structure: { connect: { id: structureId } },
      workshopName: {
        create: {
          name: faker.lorem.words(),
          structureId,
          createdById
        }
      }
    }
  })

  workshopIds.push(workshop.id)
  return workshop.id
}

afterEach(async () => await resetDatabase(workshopIds))

test('Workshop - Create External Attendee - An agent can create an external attendee and only the id of the created entity is returned', async ({
  trpc
}) => {
  const workshopId = await createWorkshop()

  const created = await trpc.receptionAgent.workshop.createExternalAttendee({
    workshopId,
    firstName: 'Marie',
    lastName: 'DUPONT',
    gender: 'Female',
    comment: 'Can only come in the morning',
    birthDate: new Date('1975/03/23')
  })

  expect(created).toStrictEqual({ id: created.id })

  const attendee = await prismaClient.workshopAttendee.findUniqueOrThrow({
    where: { id: created.id },
    include: { workshopExternalAttendee: true }
  })

  expect(attendee.listType).toBe('Main')
  expect(attendee.type).toBe('External')
  expect(attendee.comment).toBe('Can only come in the morning')
  expect(formatDate(attendee.workshopExternalAttendee?.birthDate)).toBe(
    '23/03/1975'
  )
  expect(attendee.workshopExternalAttendee?.firstName).toBe('Marie')
  expect(attendee.workshopExternalAttendee?.lastName).toBe('DUPONT')
  expect(attendee.workshopExternalAttendee?.gender).toBe('Female')
})

test('Workshop - Create External Attendee - Attendee goes to Main list when workshop not full', async ({
  trpc
}) => {
  const workshopId = await createWorkshop(5)

  const created = await trpc.receptionAgent.workshop.createExternalAttendee({
    workshopId,
    firstName: 'Jean',
    lastName: 'MARTIN'
  })

  const attendee = await prismaClient.workshopAttendee.findUniqueOrThrow({
    where: { id: created.id }
  })

  expect(attendee.listType).toBe('Main')
})

test('Workshop - Create External Attendee - Attendee goes to Waiting list when workshop full', async ({
  trpc
}) => {
  const workshopId = await createWorkshop(2)

  // Fill the workshop to capacity
  await trpc.receptionAgent.workshop.createExternalAttendee({
    workshopId,
    firstName: 'First',
    lastName: 'ATTENDEE'
  })

  await trpc.receptionAgent.workshop.createExternalAttendee({
    workshopId,
    firstName: 'Second',
    lastName: 'ATTENDEE'
  })

  // This one should go to Waiting list
  const created = await trpc.receptionAgent.workshop.createExternalAttendee({
    workshopId,
    firstName: 'Third',
    lastName: 'ATTENDEE'
  })

  const attendee = await prismaClient.workshopAttendee.findUniqueOrThrow({
    where: { id: created.id }
  })

  expect(attendee.listType).toBe('Waiting')
})

test('Workshop - Create External Attendee - Records payment received', async ({
  trpc
}) => {
  const workshopId = await createWorkshop()

  const created = await trpc.receptionAgent.workshop.createExternalAttendee({
    workshopId,
    firstName: 'Jean',
    lastName: 'DUPONT',
    paymentReceived: true,
    paymentAmount: 50
  })

  const attendee = await prismaClient.workshopAttendee.findUniqueOrThrow({
    where: { id: created.id }
  })

  expect(attendee.paymentReceived).toBe(true)
  expect(attendee.paymentAmount?.toNumber()).toEqual(50)
})

test('Workshop - Create External Attendee - Payment amount null when payment not received', async ({
  trpc
}) => {
  const workshopId = await createWorkshop()

  const created = await trpc.receptionAgent.workshop.createExternalAttendee({
    workshopId,
    firstName: 'Jean',
    lastName: 'DUPONT',
    paymentReceived: false,
    paymentAmount: 50
  })

  const attendee = await prismaClient.workshopAttendee.findUniqueOrThrow({
    where: { id: created.id }
  })

  expect(attendee.paymentReceived).toBe(false)
  expect(attendee.paymentAmount).toBeNull()
})

async function resetDatabase(workshopIds: string[]) {
  await prismaClient.workshop.deleteMany({
    where: { id: { in: workshopIds } }
  })

  await prismaClient.workshopName.deleteMany({
    where: {
      workshops: {
        none: {}
      }
    }
  })

  // Reset for next test
  workshopIds = []
}
