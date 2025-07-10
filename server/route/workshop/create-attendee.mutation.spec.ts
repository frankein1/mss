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

let workshopId: string
let workshopNameId: string
let workshopAttendeeId: string

const createRandomWorkshop = async () => {
  const createdById = fixturesUsers[FixtureUserRole.StructureManager].id
  const structureId = fixtureStructures[FixtureStructure.Test].id

  return await prismaClient.workshop.create({
    select: { id: true, workshopNameId: true },
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
    await resetDatabase(workshopId, workshopNameId, workshopAttendeeId)
)

test('Workshop - Create Attendee - An Agent cannot Create as an attendee a beneficiary from another structure', async ({
  trpc
}) => {
  const beneficiaryFromOtherStructureId =
    fixturesBeneficiaries[FixtureBeneficiary.MARTIN].id

  await expect(() =>
    trpc.structureManager.workshop.createAttendee({
      workshopId,
      beneficiaryId: beneficiaryFromOtherStructureId
    })
  ).rejects.toThrowError(/not allowed to access route/i)
})

test('Workshop - Create Attendee - An Agent cannot Create as an attendee from her structure to a workshop from another structure', async ({
  trpc
}) => {
  const beneficiaryId = fixturesBeneficiaries[FixtureBeneficiary.MARTIN].id // beneficiary from a ministere structure

  await expect(() =>
    trpc.structureManagerMinistere.workshop.createAttendee({
      workshopId,
      beneficiaryId
    })
  ).rejects.toThrowError(/not allowed to access route/i)
})

test('Workshop - Create Attendee - A reception agent can Create an attendee to a workshop and only the id of the created entity is returned', async ({
  trpc
}) => {
  const created = await trpc.receptionAgent.workshop.createAttendee({
    workshopId,
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.APFELMANN].id
  })

  workshopAttendeeId = created.id
  expect(created).toStrictEqual({ id: workshopAttendeeId })

  const attendee = await prismaClient.workshopAttendee.findUniqueOrThrow({
    where: { id: workshopAttendeeId }
  })
  expect(attendee.listType).toBe('Main')
  expect(attendee.type).toBe('Beneficiary')
})

test('Workshop - Create Attendee - An administrator cannot Create a workshop attendee', async ({
  trpc
}) => {
  await expect(() =>
    trpc.administrator.workshop.createAttendee({
      workshopId,
      beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.APFELMANN].id
    })
  ).rejects.toThrowError(/user routes are not available to admins/i)
})

async function resetDatabase(wid: string, wnid: string, waid: string) {
  if (wid) {
    await prismaClient.workshop.deleteMany({ where: { id: wid } })
  }
  if (wnid) {
    await prismaClient.workshopName.deleteMany({ where: { id: wnid } })
  }
  if (waid) {
    await prismaClient.workshopAttendee.deleteMany({ where: { id: waid } })
  }
}
