import { prismaClient } from '~/server/prisma'
import { describe, afterEach, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { UpdateWorkshopNameMode } from '~/utils/constants/workshop'

let workshopIds: string[] = []
let workshopNameIds: string[] = []
let partnerOrganizationIds: string[] = []

const date = new Date()
const structureId = fixtureStructures[FixtureStructure.Test].id
const createdById = fixturesUsers[FixtureUserRole.StructureManager].id

// Create workshop(s) with a workshop name
const createWorkshopNameWithWorkshops = async (
  workshopNameOverride?: string,
  workshopCount: number = 1
) => {
  const workshopName = workshopNameOverride || `Workshop ${Date.now()}`

  const workshopData = new Array(workshopCount).fill(null).map(() => ({
    date,
    createdById,
    structureId,
    chargeable: true
  }))

  const created = await prismaClient.workshopName.create({
    select: {
      id: true,
      name: true,
      workshops: { select: { id: true } }
    },
    data: {
      createdById,
      structureId,
      name: workshopName,
      workshops: {
        createMany: { data: workshopData }
      }
    }
  })

  workshopNameIds.push(created.id)
  const createdWorkshopIds = created.workshops.map(w => w.id)
  workshopIds.push(...createdWorkshopIds)

  return {
    ...created,
    workshopIds: createdWorkshopIds,
    workshopId: createdWorkshopIds[0]! // guaranteed to exist since workshopCount >= 1
  }
}

afterEach(
  async () =>
    await resetDatabase(workshopIds, workshopNameIds, partnerOrganizationIds)
)

describe('Workshop - Update - Update workshop data', () => {
  test('An Agent cannot update a workshop with a partner organisation from another structure', async ({
    trpc
  }) => {
    const w1 = await createWorkshopNameWithWorkshops()
    const workshopName = w1.name

    const otherPartnerOrg = await prismaClient.partnerOrganization.create({
      data: {
        structureId: fixtureStructures[FixtureStructure.Autun].id,
        name: "Organisme Partenaire du CCAS d'Autun"
      },
      select: { id: true }
    })
    partnerOrganizationIds.push(otherPartnerOrg.id)

    await expect(() =>
      trpc.structureManager.workshop.updateWorkshop({
        id: w1.workshopId,
        date,
        mode: UpdateWorkshopNameMode.current,
        name: workshopName,
        partnerOrganizationId: otherPartnerOrg.id
      })
    ).rejects.toThrowError(/not allowed to access route/i)
  })

  test('An Agent cannot update a workshop from another structure', async ({
    trpc
  }) => {
    // Create workshop in Test structure
    const w1 = await createWorkshopNameWithWorkshops()
    const workshopName = w1.name

    // Try to update it as structureManagerMinistere (belongs to Ministère structure)
    // Should fail because they don't have access to Test structure's workshops
    await expect(() =>
      trpc.structureManagerMinistere.workshop.updateWorkshop({
        id: w1.workshopId,
        date,
        mode: UpdateWorkshopNameMode.current,
        name: workshopName
      })
    ).rejects.toThrowError(/workshop[\s\S]*?no record/im)
  })

  test('A Reception Agent can update a workshop and only the id of the created entity is returned', async ({
    trpc
  }) => {
    const w1 = await createWorkshopNameWithWorkshops()
    const workshopName = w1.name

    const res = await trpc.receptionAgent.workshop.updateWorkshop({
      id: w1.workshopId,
      mode: UpdateWorkshopNameMode.current,
      name: workshopName,
      date,
      attendeeLimit: 20,
      location: 'New location'
    })

    expect(res).toStrictEqual({ id: res.id })
    const workshop = await prismaClient.workshop.findUniqueOrThrow({
      where: { id: res.id }
    })
    expect(workshop.attendeeLimit).toBe(20)
    expect(workshop.location).toBe('New location')
  })

  test('An Administrator cannot update a workshop', async ({ trpc }) => {
    const w1 = await createWorkshopNameWithWorkshops()
    const workshopName = w1.name

    await expect(() =>
      trpc.administrator.workshop.updateWorkshop({
        id: w1.workshopId,
        mode: UpdateWorkshopNameMode.current,
        name: workshopName,
        date
      })
    ).rejects.toThrowError(/user routes are not available to admins/i)
  })
})

describe('Workshop - Update - Update workshop name', () => {
  test('For Current workshop - If the name is the same, the workshop name is not updated', async ({
    trpc
  }) => {
    const w1 = await createWorkshopNameWithWorkshops('Workshop A', 2)
    const originalWorkshopNameId = w1.id

    await trpc.receptionAgent.workshop.updateWorkshop({
      id: w1.workshopId,
      date,
      mode: UpdateWorkshopNameMode.current,
      name: w1.name
    })

    const workshop = await prismaClient.workshop.findUniqueOrThrow({
      where: { id: w1.workshopId },
      select: { workshopName: { select: { id: true, name: true } } }
    })
    expect(workshop.workshopName.id).toBe(originalWorkshopNameId)
    expect(workshop.workshopName.name).toBe(w1.name)
  })

  test('For Current workshop - When name is new, a new workshop name is created and only the targeted workshop is updated', async ({
    trpc
  }) => {
    const w1 = await createWorkshopNameWithWorkshops('Workshop B', 2)
    const originalWorkshopNameId = w1.id

    await trpc.receptionAgent.workshop.updateWorkshop({
      id: w1.workshopId,
      date,
      mode: UpdateWorkshopNameMode.current,
      // The name will be trimmed when saved to DB
      name: 'new name '
    })

    const workshop = await prismaClient.workshop.findUniqueOrThrow({
      where: { id: w1.workshopId },
      select: { workshopName: { select: { id: true, name: true } } }
    })
    expect(workshop.workshopName.id).not.toBe(originalWorkshopNameId)
    expect(workshop.workshopName.name).toBe('new name')

    // Original workshop name should still exist (has other workshops)
    const oldWorkshopName = await prismaClient.workshopName.findUnique({
      select: { id: true },
      where: { id: originalWorkshopNameId }
    })
    expect(oldWorkshopName).not.toBe(null)
  })

  test('For Current workshop - When the target value is another workshop, only the targeted workshop is updated and the workshop is connected to the other workshop name', async ({
    trpc
  }) => {
    const w1 = await createWorkshopNameWithWorkshops('Workshop C', 2)
    const w2 = await createWorkshopNameWithWorkshops('Workshop D', 1)

    const originalWorkshopNameId = w1.id

    await trpc.receptionAgent.workshop.updateWorkshop({
      id: w1.workshopId,
      date,
      mode: UpdateWorkshopNameMode.current,
      name: w2.name
    })

    const workshop = await prismaClient.workshop.findUniqueOrThrow({
      where: { id: w1.workshopId },
      select: { workshopName: { select: { id: true, name: true } } }
    })
    expect(workshop.workshopName.id).toBe(w2.id)
    expect(workshop.workshopName.name).toBe(w2.name)

    // Old workshop name should still exist (orphaned)
    const oldWorkshopName = await prismaClient.workshopName.findUnique({
      select: { id: true },
      where: { id: originalWorkshopNameId }
    })
    expect(oldWorkshopName).not.toBe(null)
  })

  test('For Current workshop - When only one workshop has the previous name, the old workshop name is deleted', async ({
    trpc
  }) => {
    const w1 = await createWorkshopNameWithWorkshops('Workshop E', 1)
    const workshopNameId = w1.id

    await trpc.receptionAgent.workshop.updateWorkshop({
      id: w1.workshopId,
      date,
      mode: UpdateWorkshopNameMode.current,
      name: 'brand new name'
    })

    const workshop = await prismaClient.workshop.findUniqueOrThrow({
      where: { id: w1.workshopId },
      select: { workshopName: { select: { id: true, name: true } } }
    })
    expect(workshop.workshopName.id).not.toBe(workshopNameId)
    expect(workshop.workshopName.name).toBe('brand new name')

    // Old workshop name should be deleted (no other workshops using it)
    const oldWorkshopName = await prismaClient.workshopName.findUnique({
      select: { id: true },
      where: { id: workshopNameId }
    })
    expect(oldWorkshopName).toBe(null)
  })

  test('For all workshops - All workshops with the same name are updated and the target value is new', async ({
    trpc
  }) => {
    const w1 = await createWorkshopNameWithWorkshops('Workshop F', 3)

    await trpc.receptionAgent.workshop.updateWorkshop({
      id: w1.workshopId,
      date,
      mode: UpdateWorkshopNameMode.all,
      name: 'new shared name'
    })

    const workshops = await prismaClient.workshop.findMany({
      where: { workshopName: { name: 'new shared name' } },
      select: { id: true }
    })
    expect(workshops).toHaveLength(3)
  })

  test('For all workshops - All workshops with the same name are updated, the target value is another workshop, the previous workshop name is deleted', async ({
    trpc
  }) => {
    const w1 = await createWorkshopNameWithWorkshops('Workshop G', 2)
    const w2 = await createWorkshopNameWithWorkshops('Workshop H', 2)
    const originalName = w1.name

    await trpc.receptionAgent.workshop.updateWorkshop({
      id: w1.workshopId,
      date,
      mode: UpdateWorkshopNameMode.all,
      name: w2.name
    })

    const workshops = await prismaClient.workshop.findMany({
      where: { workshopName: { name: w2.name } },
      select: { id: true }
    })
    expect(workshops).toHaveLength(4)

    const oldWorkshopName = await prismaClient.workshopName.findUnique({
      where: {
        structureId_name: {
          structureId,
          name: originalName
        }
      }
    })
    expect(oldWorkshopName).toBe(null)
  })

  test('For all workshops - All workshops with the same name are updated and the target value has the same content with a different case', async ({
    trpc
  }) => {
    const w1 = await createWorkshopNameWithWorkshops('workshop i', 2)
    const originalName = w1.name

    await trpc.receptionAgent.workshop.updateWorkshop({
      id: w1.workshopId,
      date,
      mode: UpdateWorkshopNameMode.all,
      name: 'WORKSHOP I'
    })

    const workshops = await prismaClient.workshop.findMany({
      where: { workshopName: { name: 'WORKSHOP I' } },
      select: { id: true }
    })
    expect(workshops).toHaveLength(2)

    const oldWorkshopName = await prismaClient.workshopName.findUnique({
      where: {
        structureId_name: {
          structureId,
          name: originalName
        }
      }
    })
    expect(oldWorkshopName).toBe(null)
  })
})

describe('Workshop - Update - Update chargeable to false', () => {
  test('Delete attendee payment info on workshop previously chargeable', async ({
    trpc
  }) => {
    const w1 = await createWorkshopNameWithWorkshops('Chargeable Workshop', 1)

    // Add attendee with payment info
    const attendee = await trpc.socialWorker.workshop.createExternalAttendee({
      workshopId: w1.workshopId,
      firstName: 'John',
      lastName: 'Doe',
      paymentReceived: true,
      paymentAmount: 8
    })

    // Update workshop to not chargeable
    await trpc.socialWorker.workshop.updateWorkshop({
      id: w1.workshopId,
      chargeable: false,
      date,
      name: 'Free Workshop',
      mode: UpdateWorkshopNameMode.all
    })

    // Attendee should not have payment info anymore
    const attendeeWithPaymentInfo =
      await prismaClient.workshopAttendee.findFirstOrThrow({
        select: {
          id: true,
          paymentReceived: true,
          paymentAmount: true
        },
        where: {
          id: attendee.id
        }
      })

    expect(attendeeWithPaymentInfo.paymentReceived).toBe(null)
    expect(attendeeWithPaymentInfo.paymentAmount).toBe(null)
  })
})

async function resetDatabase(wids: string[], wnids: string[], poids: string[]) {
  // Cascade delete handles WorkshopAttendee and WorkshopExternalAttendee
  if (wids.length > 0) {
    await prismaClient.workshop.deleteMany({
      where: { id: { in: wids } }
    })
  }

  if (wnids.length > 0) {
    await prismaClient.workshopName.deleteMany({
      where: { id: { in: wnids } }
    })
  }

  if (poids.length > 0) {
    await prismaClient.partnerOrganization.deleteMany({
      where: { id: { in: poids } }
    })
  }

  // Reset for next test
  workshopIds = []
  workshopNameIds = []
  partnerOrganizationIds = []
}
