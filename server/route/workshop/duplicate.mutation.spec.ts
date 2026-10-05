import { prismaClient } from '~~/server/prisma'
import { describe, beforeEach, afterEach, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole,
  fixturesBeneficiaries
} from '~~/prisma/fixtures'
import { faker } from '@faker-js/faker'
import { WorkshopAttendeeType, WorkshopAttendeeListType } from '@prisma/client'

// External attendees created here are tagged so teardown can remove the
// WorkshopExternalAttendee rows, which are not cascaded when the workshop is
// deleted (only the WorkshopAttendee join rows are).
const EXTERNAL_LAST_NAME_PREFIX = 'DUPTEST-'

let workshopIds: string[] = []

const createdById = fixturesUsers[FixtureUserRole.StructureManager].id
const structureId = fixtureStructures[FixtureStructure.Test].id

/**
 * Source workshop with a deterministic, cross-type interleaved arrival order:
 * beneficiary (t0), external (t1), beneficiary (t2), external (t3).
 * The external created earliest gets a last name that sorts last, so a
 * name-based sort would produce a different order than the arrival order.
 */
const createSourceWorkshop = async () => {
  const base = new Date('2026-01-01T10:00:00.000Z').getTime()
  const at = (offsetMs: number) => new Date(base + offsetMs)

  const workshop = await prismaClient.workshop.create({
    select: { id: true },
    data: {
      date: new Date(),
      attendeeLimit: null,
      createdBy: { connect: { id: createdById } },
      structure: { connect: { id: structureId } },
      workshopName: {
        create: { name: faker.lorem.words(), structureId, createdById }
      },
      workshopAttendees: {
        create: [
          {
            type: WorkshopAttendeeType.Beneficiary,
            listType: WorkshopAttendeeListType.Main,
            created: at(0),
            beneficiary: { connect: { id: fixturesBeneficiaries[0].id } }
          },
          {
            type: WorkshopAttendeeType.External,
            listType: WorkshopAttendeeListType.Main,
            created: at(1),
            workshopExternalAttendee: {
              create: {
                firstName: 'Zoe',
                lastName: `${EXTERNAL_LAST_NAME_PREFIX}ZULU`
              }
            }
          },
          {
            type: WorkshopAttendeeType.Beneficiary,
            listType: WorkshopAttendeeListType.Main,
            created: at(2),
            beneficiary: { connect: { id: fixturesBeneficiaries[1].id } }
          },
          {
            type: WorkshopAttendeeType.External,
            listType: WorkshopAttendeeListType.Main,
            created: at(3),
            workshopExternalAttendee: {
              create: {
                firstName: 'Alan',
                lastName: `${EXTERNAL_LAST_NAME_PREFIX}ALPHA`
              }
            }
          }
        ]
      }
    }
  })

  return workshop
}

const identify = (a: {
  type: WorkshopAttendeeType
  beneficiaryId: string | null
  workshopExternalAttendee: { lastName: string | null } | null
}) => ({
  type: a.type,
  key: a.beneficiaryId ?? a.workshopExternalAttendee?.lastName ?? null
})

const readOrderedAttendees = (workshopId: string) =>
  prismaClient.workshopAttendee.findMany({
    where: { workshopId },
    orderBy: [{ created: 'asc' }, { id: 'asc' }],
    select: {
      type: true,
      beneficiaryId: true,
      workshopExternalAttendee: { select: { lastName: true } }
    }
  })

describe('Workshop - Duplicate - Attendee ordering', () => {
  beforeEach(async () => {
    const source = await createSourceWorkshop()
    workshopIds = [source.id]
  })

  afterEach(async () => {
    await prismaClient.workshop.deleteMany({
      where: { id: { in: workshopIds } }
    })
    await prismaClient.workshopExternalAttendee.deleteMany({
      where: { lastName: { startsWith: EXTERNAL_LAST_NAME_PREFIX } }
    })
    await prismaClient.workshopName.deleteMany({
      where: { workshops: { none: {} } }
    })
    workshopIds = []
  })

  test('A manager duplicating with participants keeps the source arrival order, interleaving beneficiaries and externals', async ({
    trpc
  }) => {
    const sourceWorkshopId = workshopIds[0] as string

    const duplicated = await trpc.structureManager.workshop.duplicateWorkshop({
      sourceWorkshopId,
      duplicateParticipants: true,
      name: faker.lorem.words(),
      date: new Date(),
      chargeable: false
    })
    workshopIds.push(duplicated.id)

    const attendees = await readOrderedAttendees(duplicated.id)

    // The cross-type arrival order of the source is preserved exactly:
    // b0 (t0), ZULU (t1), b1 (t2), ALPHA (t3) — beneficiaries and externals
    // stay interleaved, and ZULU precedes ALPHA by arrival, not alphabetically.
    expect(attendees.map(identify)).toEqual([
      { type: 'Beneficiary', key: fixturesBeneficiaries[0].id },
      { type: 'External', key: `${EXTERNAL_LAST_NAME_PREFIX}ZULU` },
      { type: 'Beneficiary', key: fixturesBeneficiaries[1].id },
      { type: 'External', key: `${EXTERNAL_LAST_NAME_PREFIX}ALPHA` }
    ])
  })

  test('The duplicated attendees have strictly increasing created timestamps so the order is stable', async ({
    trpc
  }) => {
    const sourceWorkshopId = workshopIds[0] as string

    const duplicated = await trpc.structureManager.workshop.duplicateWorkshop({
      sourceWorkshopId,
      duplicateParticipants: true,
      name: faker.lorem.words(),
      date: new Date(),
      chargeable: false
    })
    workshopIds.push(duplicated.id)

    const attendees = await prismaClient.workshopAttendee.findMany({
      where: { workshopId: duplicated.id },
      orderBy: [{ created: 'asc' }, { id: 'asc' }],
      select: { created: true }
    })

    const times = attendees.map(a => a.created?.getTime() ?? 0)
    expect(times).toHaveLength(4)
    for (let i = 1; i < times.length; i++) {
      expect(times[i]).toBeGreaterThan(times[i - 1] as number)
    }
  })
})
