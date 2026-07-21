import { prismaClient } from '~/server/prisma'
import { describe, beforeEach, afterEach, expect } from 'vitest'
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

let workshopIds: string[]

const createWorkshopWithBeneficiaryAttendees = async (
  attendeeLimit: number | undefined = undefined,
  nAttendees: number = 0
) => {
  const createdById = fixturesUsers[FixtureUserRole.StructureManager].id
  const structureId = fixtureStructures[FixtureStructure.Test].id

  if (nAttendees > fixturesBeneficiaries.length) {
    throw new Error('Not enough beneficiaries to add as attendees')
  }

  return await prismaClient.workshop.create({
    select: { id: true, workshopNameId: true },
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
      },
      ...(nAttendees && {
        workshopAttendees: {
          create: new Array(nAttendees).fill(null).map((_, i) => ({
            type: WorkshopAttendeeType.Beneficiary,
            listType: 'Main',
            beneficiary: {
              connect: { id: fixturesBeneficiaries[i]?.id as string }
            }
          }))
        }
      })
    }
  })
}

function invalidsetup() {
  return new Error('test: invalid test data')
}

afterEach(async () => await resetDatabase(workshopIds))

describe('Authorizations', () => {
  beforeEach(async () => {
    const w = await createWorkshopWithBeneficiaryAttendees()
    workshopIds = [w.id]
  })

  test('Create Beneficiary Attendee - An Agent cannot Create as an attendee a beneficiary from another structure', async ({
    trpc
  }) => {
    const beneficiaryFromOtherStructureId =
      fixturesBeneficiaries[FixtureBeneficiary.MARTIN].id

    await expect(() =>
      trpc.structureManager.workshop.createBeneficiaryAttendee({
        workshopIds,
        beneficiaryId: beneficiaryFromOtherStructureId
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('Create Beneficiary Attendee - An Agent cannot Create as an attendee from her structure to a workshop from another structure', async ({
    trpc
  }) => {
    const beneficiaryId = fixturesBeneficiaries[FixtureBeneficiary.MARTIN].id // beneficiary from a ministere structure

    await expect(() =>
      trpc.structureManagerMinistere.workshop.createBeneficiaryAttendee({
        workshopIds,
        beneficiaryId
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('Create Beneficiary Attendee - An administrator cannot Create a workshop attendee', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.administrator.workshop.createBeneficiaryAttendee({
        workshopIds,
        beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.APFELMANN].id
      })
    ).rejects.toThrow(/user routes are not available to admins/i)
  })
})

describe('Workshop without attendee limit', () => {
  beforeEach(async () => {
    const ws = await Promise.all([
      createWorkshopWithBeneficiaryAttendees(),
      createWorkshopWithBeneficiaryAttendees(),
      createWorkshopWithBeneficiaryAttendees()
    ])
    workshopIds = ws.map(w => w.id)
  })

  test('Create Beneficiary Attendee - A reception agent can create an attendee to a workshop and only the id of the created entity is returned', async ({
    trpc
  }) => {
    if (!workshopIds[0]) {
      throw invalidsetup()
    }
    const attendees =
      await trpc.receptionAgent.workshop.createBeneficiaryAttendee({
        workshopIds: [workshopIds[0]],
        beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.APFELMANN].id
      })

    const attendeeId = attendees[0]?.id as string
    expect(attendees).toStrictEqual([
      {
        id: attendeeId,
        listType: 'Main'
      }
    ])

    const attendee = await prismaClient.workshopAttendee.findUniqueOrThrow({
      where: { id: attendeeId }
    })
    expect(attendee.listType).toBe('Main')
    expect(attendee.type).toBe('Beneficiary')
  })

  test('Create Beneficiary Attendee - An agent can add a beneficiary to several workshops', async ({
    trpc
  }) => {
    const beneficiaryId = fixturesBeneficiaries[FixtureBeneficiary.APFELMANN].id

    await trpc.receptionAgent.workshop.createBeneficiaryAttendee({
      workshopIds,
      beneficiaryId
    })

    const attendees = await prismaClient.workshop.findMany({
      where: { id: { in: workshopIds } },
      select: {
        id: true,
        workshopAttendees: {
          select: { listType: true, beneficiaryId: true }
        }
      }
    })

    expect(attendees).toHaveLength(3)
    expect(new Set(attendees)).toEqual(
      new Set([
        {
          id: workshopIds[0],
          workshopAttendees: [{ beneficiaryId, listType: 'Main' }]
        },
        {
          id: workshopIds[1],
          workshopAttendees: [{ beneficiaryId, listType: 'Main' }]
        },
        {
          id: workshopIds[2],
          workshopAttendees: [{ beneficiaryId, listType: 'Main' }]
        }
      ])
    )
  })
})

describe('Workshop with attendee limit', () => {
  beforeEach(async () => {
    const ws = await Promise.all([
      createWorkshopWithBeneficiaryAttendees(4, 3),
      createWorkshopWithBeneficiaryAttendees(1, 1),
      createWorkshopWithBeneficiaryAttendees(2, 2),
      createWorkshopWithBeneficiaryAttendees(10, 5)
    ])
    workshopIds = ws.map(w => w.id)
  })

  test('Create Beneficiary Attendee - An agent can add an attendee to several workshops', async ({
    trpc
  }) => {
    const beneficiaryId = fixturesBeneficiaries[FixtureBeneficiary.APFELMANN].id

    await trpc.receptionAgent.workshop.createBeneficiaryAttendee({
      workshopIds,
      beneficiaryId
    })

    const attendees = await prismaClient.workshop.findMany({
      where: { id: { in: workshopIds } },
      select: {
        id: true,
        workshopAttendees: {
          select: { listType: true, beneficiaryId: true }
        },
        _count: { select: { workshopAttendees: true } }
      }
    })

    const format = (workshops: typeof attendees) =>
      workshops.map(w => ({
        ...w,
        workshopAttendees: w.workshopAttendees.filter(
          a => a.beneficiaryId === beneficiaryId
        )
      }))

    expect(attendees).toHaveLength(4)
    expect(new Set(format(attendees))).toEqual(
      new Set([
        {
          id: workshopIds[0],
          workshopAttendees: [{ beneficiaryId, listType: 'Main' }],
          _count: { workshopAttendees: 4 }
        },
        {
          id: workshopIds[1],
          workshopAttendees: [{ beneficiaryId, listType: 'Waiting' }],
          _count: { workshopAttendees: 2 }
        },
        {
          id: workshopIds[2],
          workshopAttendees: [{ beneficiaryId, listType: 'Waiting' }],
          _count: { workshopAttendees: 3 }
        },
        {
          id: workshopIds[3],
          workshopAttendees: [{ beneficiaryId, listType: 'Main' }],
          _count: { workshopAttendees: 6 }
        }
      ])
    )
  })
})

describe('Performance', () => {
  beforeEach(async () => {
    const createdById = fixturesUsers[FixtureUserRole.StructureManager].id
    const structureId = fixtureStructures[FixtureStructure.Test].id

    const name = await prismaClient.workshopName.create({
      data: {
        name: faker.lorem.words(),
        structureId,
        createdById
      }
    })

    const workshops = await prismaClient.workshop.createManyAndReturn({
      select: { id: true },
      data: new Array(100).fill(null).map(() => ({
        date: new Date(),
        createdById,
        structureId,
        workshopNameId: name.id
      }))
    })

    workshopIds = workshops.map(w => w.id)
  })

  test('Perf – Adding a beneficiary to 100 workshops takes less than 100 ms', async ({
    trpc
  }) => {
    const start = performance.now()
    const attendees =
      await trpc.structureManager.workshop.createBeneficiaryAttendee({
        workshopIds,
        beneficiaryId: fixturesBeneficiaries[0].id
      })
    const end = performance.now()

    expect(attendees).toHaveLength(100)
    const duration = end - start
    console.log(
      `Duration for registering beneficiary to 100 workshops: ${duration} ms`
    )
    expect(duration).toBeLessThanOrEqual(100)
  }, 3000)
})

async function resetDatabase(workshopIds: string[]) {
  await prismaClient.workshop.deleteMany({
    where: {
      id: { in: workshopIds }
    }
  })

  await prismaClient.workshopName.deleteMany({
    where: {
      workshops: {
        none: {}
      }
    }
  })
}
