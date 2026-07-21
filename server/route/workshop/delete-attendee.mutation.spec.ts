import { prismaClient } from '~/server/prisma'
import { beforeEach, afterEach, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole,
  fixturesBeneficiaries,
  FixtureBeneficiary
} from '~/prisma/fixtures'
import { faker } from '@faker-js/faker'
import { WorkshopAttendeeType } from '@prisma/client'

let workshopId: string
let workshopNameId: string
let workshopAttendeesId: string[]
let workshopExternalAttendeesId: (string | null)[]

const createRandomWorkshop = async () => {
  const createdById = fixturesUsers[FixtureUserRole.StructureManager].id
  const structureId = fixtureStructures[FixtureStructure.Test].id

  return await prismaClient.workshop.create({
    select: {
      id: true,
      workshopNameId: true,
      workshopAttendees: {
        select: { id: true, workshopExternalAttendeeId: true }
      }
    },
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
        create: {
          type: WorkshopAttendeeType.External,
          listType: 'Main',
          comment: 'external attendee',
          workshopExternalAttendee: {
            create: {
              firstName: 'Marie',
              lastName: 'DUPONT',
              gender: 'Female'
            }
          }
        },
        createMany: {
          data: [
            {
              type: WorkshopAttendeeType.Beneficiary,
              beneficiaryId:
                fixturesBeneficiaries[FixtureBeneficiary.APFELMANN].id,
              listType: 'Main',
              comment: 'beneficiary attendee'
            }
          ]
        }
      }
    }
  })
}

beforeEach(async () => {
  workshopAttendeesId = []
  workshopExternalAttendeesId = []

  const w = await createRandomWorkshop()
  workshopId = w.id
  workshopNameId = w.workshopNameId
  if (w.workshopAttendees[0]) {
    workshopAttendeesId.push(w.workshopAttendees[0].id)
    workshopExternalAttendeesId.push(
      w.workshopAttendees[0].workshopExternalAttendeeId || null
    )
  }
  if (w.workshopAttendees[1]) {
    workshopAttendeesId.push(w.workshopAttendees[1].id)
    workshopExternalAttendeesId.push(
      w.workshopAttendees[1].workshopExternalAttendeeId || null
    )
  }
})

afterEach(
  async () =>
    await resetDatabase(
      workshopId,
      workshopNameId,
      workshopAttendeesId,
      workshopExternalAttendeesId
    )
)

function invalidsetup() {
  return new Error('test: invalid test data')
}

test('Workshop - Create Attendee - An Agent cannot delete an attendee of a workshop from another structure', async ({
  trpc
}) => {
  // agent from a ministere structure
  await expect(
    () =>
      workshopAttendeesId[0] &&
      trpc.structureManagerMinistere.workshop.deleteAttendee({
        id: workshopAttendeesId[0],
        type: WorkshopAttendeeType.Beneficiary
      })
  ).rejects.toThrow(/workshop[\s\S]*?no record/im)
})

test('Workshop - Delete Attendee - An agent can delete an attendee that is a beneficiary and the id and type of the deleted entity is returned', async ({
  trpc
}) => {
  if (!workshopAttendeesId[0]) {
    throw invalidsetup()
  }

  const deleted = await trpc.receptionAgent.workshop.deleteAttendee({
    id: workshopAttendeesId[0],
    type: WorkshopAttendeeType.Beneficiary
  })

  expect(deleted).toStrictEqual({
    type: 'Beneficiary',
    id: workshopAttendeesId[0]
  })
  const found = await prismaClient.workshopAttendee.findUnique({
    select: { id: true },
    where: { id: deleted.id }
  })
  expect(found).toBe(null)
})

test('Workshop - Delete Attendee - An agent can delete an external attendee and the id and type of the deleted entity is returned', async ({
  trpc
}) => {
  if (!workshopAttendeesId[1]) {
    throw invalidsetup()
  }

  const deleted = await trpc.receptionAgent.workshop.deleteAttendee({
    id: workshopAttendeesId[1],
    type: WorkshopAttendeeType.External
  })

  expect(deleted).toStrictEqual({
    type: 'External',
    id: workshopAttendeesId[1]
  })
  const found = await prismaClient.workshopAttendee.findUnique({
    select: { id: true },
    where: { id: deleted.id }
  })
  expect(found).toBe(null)
})

test('Workshop - Delete Attendee - An administrator cannot delete a workshop attendee', async ({
  trpc
}) => {
  await expect(
    () =>
      workshopAttendeesId[0] &&
      trpc.administrator.workshop.deleteAttendee({
        id: workshopAttendeesId[0],
        type: WorkshopAttendeeType.Beneficiary
      })
  ).rejects.toThrow(/user routes are not available to admins/i)
})

async function resetDatabase(
  wid: string,
  wnid: string,
  waid: string[],
  weaid: (string | null)[]
) {
  if (wid) {
    await prismaClient.workshop.deleteMany({ where: { id: wid } })
  }
  if (wnid) {
    await prismaClient.workshopName.deleteMany({ where: { id: wnid } })
  }
  if (waid) {
    await prismaClient.workshopAttendee.deleteMany({
      where: { id: { in: waid } }
    })
  }
  if (weaid) {
    await prismaClient.workshopExternalAttendee.deleteMany({
      where: { id: { in: weaid.filter(Boolean) as string[] } }
    })
  }
}
