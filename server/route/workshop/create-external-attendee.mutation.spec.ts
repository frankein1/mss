import { prismaClient } from '~/server/prisma'
import { beforeEach, afterEach, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { faker } from '@faker-js/faker'
import { formatDate } from '~/utils/formatDate'

let workshopId: string
let workshopNameId: string
let workshopAttendeeId: string
let workshopExternalAttendeeId: string

const createRandomWorkshop = async () => {
  const createdById = fixturesUsers[FixtureUserRole.StructureManager].id
  const structureId = fixtureStructures[FixtureStructure.Test].id

  const name = faker.lorem.words()
  console.log(name)
  return await prismaClient.workshop.create({
    select: { id: true, workshopNameId: true },
    data: {
      date: new Date(),
      createdBy: { connect: { id: createdById } },
      structure: { connect: { id: structureId } },
      workshopName: {
        create: {
          name,
          structureId,
          createdById
        }
      }
    }
  })
}

beforeEach(async () => {
  const w = await createRandomWorkshop()
  workshopId = w.id
  workshopNameId = w.workshopNameId
})

afterEach(
  async () =>
    await resetDatabase(
      workshopId,
      workshopNameId,
      workshopAttendeeId,
      workshopExternalAttendeeId
    )
)

test('Workshop - Create External Attendee - An agent can create an external attendee and only the id of the created entity is returned', async ({
  trpc
}) => {
  const created = await trpc.receptionAgent.workshop.createExternalAttendee({
    workshopId,
    firstName: 'Marie',
    lastName: 'DUPONT',
    gender: 'Female',
    comment: 'Can only come in the morning',
    birthDate: '1975/03/23'
  })

  workshopAttendeeId = created.id

  const attendee = await prismaClient.workshopAttendee.findUniqueOrThrow({
    where: { id: workshopAttendeeId },
    include: { workshopExternalAttendee: true }
  })
  workshopExternalAttendeeId = attendee.workshopExternalAttendeeId as string

  expect(created).toStrictEqual({ id: workshopAttendeeId })

  expect(attendee.listType).toBe('Main')
  expect(attendee.type).toBe('External')
  expect(attendee.comment).toBe('Can only come in the morning')
  expect(formatDate(attendee.workshopExternalAttendee?.birthDate)).toBe(
    '23/03/1975'
  )
})

async function resetDatabase(
  wid: string,
  wnid: string,
  waid: string,
  weaid: string
) {
  if (wid) {
    await prismaClient.workshop.deleteMany({ where: { id: wid } })
  }
  if (wnid) {
    await prismaClient.workshopName.deleteMany({ where: { id: wnid } })
  }
  if (waid) {
    await prismaClient.workshopAttendee.deleteMany({ where: { id: waid } })
  }
  if (weaid) {
    await prismaClient.workshopExternalAttendee.deleteMany({
      where: { id: weaid }
    })
  }
}
