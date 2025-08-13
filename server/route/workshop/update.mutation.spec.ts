import { prismaClient } from '~/server/prisma'
import { describe, beforeEach, afterEach, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { faker } from '@faker-js/faker'
import { UpdateWorkshopNameMode } from '~/utils/constants/workshop'

let workshopIds: string[]
let workshopNames: string[]
let workshopNamesIds: string[]
let otherPartnerOrganizationId: string

const date = new Date()
const N_WORKSHOPS = 10
const structureId = fixtureStructures[FixtureStructure.Test].id

const createWorkshopsWithName = async (
  structureId: string,
  createdById: string,
  name: string,
  n = N_WORKSHOPS
) => {
  const data = new Array(n).fill(null).map(() => ({
    date,
    createdById,
    structureId
  }))

  return await prismaClient.workshopName.create({
    select: {
      id: true,
      name: true,
      workshops: { select: { id: true } }
    },
    data: {
      createdById,
      structureId,
      name,
      workshops: {
        createMany: { data }
      }
    }
  })
}

beforeEach(async () => {
  const createdById = fixturesUsers[FixtureUserRole.StructureManager].id

  const [w1, w2] = await Promise.all([
    createWorkshopsWithName(structureId, createdById, faker.word.adverb()),
    createWorkshopsWithName(structureId, createdById, faker.word.adverb())
  ])
  workshopIds = []
  workshopIds.push(...w1.workshops.map(w => w.id))
  workshopIds.push(...w2.workshops.map(w => w.id))
  workshopNames = []
  workshopNames.push(w1.name, w2.name)
  workshopNamesIds = []
  workshopNamesIds.push(w1.id, w2.id)
})

afterEach(
  async () =>
    await resetDatabase(
      workshopIds,
      workshopNamesIds,
      otherPartnerOrganizationId
    )
)

describe('Workshop - Update - Update workshop data', () => {
  test('Workshop - Update - An Agent cannot update a workshop with a partner organisation from another structure', async ({
    trpc
  }) => {
    const otherPartnerOrg = await prismaClient.partnerOrganization.create({
      data: {
        structureId: fixtureStructures[FixtureStructure.Autun].id,
        name: 'Organisation Partenaire de la structure d Autun'
      },
      select: { id: true }
    })
    otherPartnerOrganizationId = otherPartnerOrg.id

    await expect(() =>
      trpc.structureManager.workshop.updateWorkshop({
        id: workshopIds[0],
        mode: UpdateWorkshopNameMode.current,
        name: workshopNames[0],
        date,
        partnerOrganizationId: otherPartnerOrganizationId
      })
    ).rejects.toThrowError(/not allowed to access route/i)
  })

  test('Workshop - Update - An Agent cannot update a workshop from another structure', async ({
    trpc
  }) => {
    const workshopFromOtherStructure = await createWorkshopsWithName(
      fixtureStructures[FixtureStructure.Autun].id,
      fixturesUsers[FixtureUserRole.StructureManagerNew].id,
      faker.word.adverb(),
      1
    )
    workshopIds.push(...workshopFromOtherStructure.workshops.map(w => w.id))
    workshopNames.push(workshopFromOtherStructure.name)
    workshopNamesIds.push(workshopFromOtherStructure.id)

    await expect(() =>
      trpc.structureManager.workshop.updateWorkshop({
        id: workshopFromOtherStructure.workshops[0].id,
        mode: UpdateWorkshopNameMode.current,
        name: workshopFromOtherStructure.name,
        date
      })
    ).rejects.toThrowError(/workshop[\s\S]*?no record/im)
  })

  test('Workshop - Update - An Reception Agent can update a workshop and only the id of the created entity is returned', async ({
    trpc
  }) => {
    const res = await trpc.receptionAgent.workshop.updateWorkshop({
      id: workshopIds[0],
      mode: UpdateWorkshopNameMode.current,
      name: workshopNames[0],
      date,
      attendeeLimit: 20,
      location: 'New location'
    })

    const workshopId = res.id
    expect(res).toStrictEqual({ id: workshopId })
    const workshop = await prismaClient.workshop.findUniqueOrThrow({
      where: { id: workshopId }
    })
    expect(workshop.attendeeLimit).toBe(20)
    expect(workshop.location).toBe('New location')
  })

  test('Workshop - Update - An Administrator cannot update a workshop', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.administrator.workshop.updateWorkshop({
        id: workshopIds[0],
        mode: UpdateWorkshopNameMode.current,
        name: workshopNames[0],
        date
      })
    ).rejects.toThrowError(/user routes are not available to admins/i)
  })
})

describe('Workshop - Update - Update workshop name', () => {
  test('Workshop - Update Name For Current workshop - If the name is the same, the workshop name is not updated', async ({
    trpc
  }) => {
    const id = workshopIds[0]
    const workshopNameInDb = workshopNames[0]
    const mode = UpdateWorkshopNameMode.current

    await trpc.receptionAgent.workshop.updateWorkshop({
      id,
      date,
      mode,
      name: workshopNameInDb
    })

    const workshop = await prismaClient.workshop.findUniqueOrThrow({
      where: { id },
      select: { workshopName: { select: { id: true, name: true } } }
    })
    expect(workshop.workshopName.id).toBe(workshopNamesIds[0])
    expect(workshop.workshopName.name).toBe(workshopNameInDb)
  })

  test('Workshop - Update Name For Current workshop - When name is new, a new workshop name is created and only the targeted workshop is updated', async ({
    trpc
  }) => {
    const id = workshopIds[0]
    const mode = UpdateWorkshopNameMode.current

    await trpc.receptionAgent.workshop.updateWorkshop({
      id,
      date,
      mode,
      name: 'new name  '
    })

    const workshop = await prismaClient.workshop.findUniqueOrThrow({
      where: { id },
      select: { workshopName: { select: { id: true, name: true } } }
    })
    workshopNames.push(workshop.workshopName.name)
    workshopNamesIds.push(workshop.workshopName.id)
    expect(workshop.workshopName.id).not.toBe(workshopNamesIds[0])
    expect(workshop.workshopName.name).toBe('new name')
  })

  test('Workshop - Update Name For Current workshop - When the target value is another workshop, only the targeted workshop is updated and the workshop is connected to the other workshop name', async ({
    trpc
  }) => {
    const id = workshopIds[0]
    const mode = UpdateWorkshopNameMode.current

    await trpc.receptionAgent.workshop.updateWorkshop({
      id,
      date,
      mode,
      name: workshopNames[1]
    })

    const workshop = await prismaClient.workshop.findUniqueOrThrow({
      where: { id },
      select: { workshopName: { select: { id: true, name: true } } }
    })
    expect(workshop.workshopName.id).toBe(workshopNamesIds[1])
    expect(workshop.workshopName.name).toBe(workshopNames[1])
  })

  test('Workshop - Update Name - All workshops with the same name are updated and the target value is new', async ({
    trpc
  }) => {
    const id = workshopIds[0]
    const mode = UpdateWorkshopNameMode.all

    await trpc.receptionAgent.workshop.updateWorkshop({
      id,
      date,
      mode,
      name: 'new name  '
    })

    const workshops = await prismaClient.workshop.findMany({
      where: { workshopName: { name: 'new name' } },
      select: { id: true }
    })
    expect(workshops).toHaveLength(N_WORKSHOPS)
    expect(new Set(workshops.map(w => w.id))).toEqual(
      new Set(workshopIds.slice(0, N_WORKSHOPS))
    )
  })

  test('Workshop - Update Name - All workshops with the same name are updated, the target value is another workshop, the previous workshop name is deleted', async ({
    trpc
  }) => {
    const id = workshopIds[0]
    const workshopNameInDb = workshopNames[0]
    const mode = UpdateWorkshopNameMode.all

    await trpc.receptionAgent.workshop.updateWorkshop({
      id,
      date,
      mode,
      name: workshopNames[1]
    })

    const workshops = await prismaClient.workshop.findMany({
      where: { workshopName: { name: workshopNames[1] } },
      select: { id: true }
    })
    expect(workshops).toHaveLength(N_WORKSHOPS * 2)
    const workshopName = await prismaClient.workshopName.findUnique({
      where: {
        structureId_name: {
          structureId,
          name: workshopNameInDb
        }
      }
    })
    expect(workshopName).toBe(null)
  })

  test('Workshop - Update Name - All workshops with the same name are updated and the target value has the same content with a different case', async ({
    trpc
  }) => {
    const id = workshopIds[0]
    const workshopNameInDb = workshopNames[0]
    const mode = UpdateWorkshopNameMode.all

    await trpc.receptionAgent.workshop.updateWorkshop({
      id,
      date,
      mode,
      name: workshopNameInDb.toLocaleUpperCase()
    })

    const workshops = await prismaClient.workshop.findMany({
      where: { workshopName: { name: workshopNameInDb.toLocaleUpperCase() } },
      select: { id: true }
    })
    expect(workshops).toHaveLength(N_WORKSHOPS)
    expect(new Set(workshops.map(w => w.id))).toEqual(
      new Set(workshopIds.slice(0, N_WORKSHOPS))
    )
    const workshopName = await prismaClient.workshopName.findUnique({
      where: {
        structureId_name: {
          structureId,
          name: workshopNameInDb
        }
      }
    })
    expect(workshopName).toBe(null)
  })
})

async function resetDatabase(wids: string[], wnids: string[], poid: string) {
  if (wids) {
    await prismaClient.workshop.deleteMany({ where: { id: { in: wids } } })
  }
  if (wnids) {
    await prismaClient.workshopName.deleteMany({
      where: { id: { in: wnids } }
    })
  }
  if (poid) {
    await prismaClient.partnerOrganization.deleteMany({ where: { id: poid } })
  }
}
