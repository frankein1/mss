import { prismaClient } from '~~/server/prisma'
import { afterEach, describe, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~~/prisma/fixtures'

const structureId = fixtureStructures[FixtureStructure.Test].id
const managerId = fixturesUsers[FixtureUserRole.StructureManager].id

let workshopId: string
let otherPartnerOrganizationId: string
const supportProgramNameIds: string[] = []

afterEach(async () => {
  if (workshopId) {
    await prismaClient.workshop.deleteMany({ where: { id: workshopId } })
    workshopId = ''
  }
  if (otherPartnerOrganizationId) {
    await prismaClient.partnerOrganization.deleteMany({
      where: { id: otherPartnerOrganizationId }
    })
    otherPartnerOrganizationId = ''
  }
  if (supportProgramNameIds.length > 0) {
    await prismaClient.supportProgramName.deleteMany({
      where: { id: { in: supportProgramNameIds } }
    })
    supportProgramNameIds.length = 0
  }
})

describe('Workshop - Create - Authorizations', () => {
  test('An Agent cannot create a workshop with a partner organisation from another structure', async ({
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
      trpc.structureManager.workshop.createWorkshop({
        name: 'Atelier Numérique',
        date: new Date(),
        partnerOrganizationId: otherPartnerOrganizationId
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('An Agent cannot create a workshop with a support program name from another structure', async ({
    trpc
  }) => {
    const otherProgramName = await prismaClient.supportProgramName.create({
      data: {
        name: `CWK-Other-${Date.now()}`,
        structureId: fixtureStructures[FixtureStructure.Autun].id,
        createdById: managerId
      },
      select: { id: true }
    })
    supportProgramNameIds.push(otherProgramName.id)

    await expect(() =>
      trpc.structureManager.workshop.createWorkshop({
        name: 'Atelier cross-structure',
        date: new Date(),
        supportProgramNameId: otherProgramName.id
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('An administrator cannot create a workshop', async ({ trpc }) => {
    await expect(() =>
      trpc.administrator.workshop.createWorkshop({
        name: 'Atelier Numérique',
        date: new Date()
      })
    ).rejects.toThrow(/user routes are not available to admins/i)
  })
})

describe('Workshop - Create - Behavior', () => {
  test('A reception agent can create a workshop and only the id of the created entity is returned', async ({
    trpc
  }) => {
    const workshop = await trpc.receptionAgent.workshop.createWorkshop({
      name: 'Atelier Numérique',
      date: new Date()
    })

    workshopId = workshop.id
    expect(workshop).toStrictEqual({ id: workshopId })
  })

  test('A manager can create a workshop with a support program name', async ({
    trpc
  }) => {
    const programName = await prismaClient.supportProgramName.create({
      data: {
        name: `CWK-Program-${Date.now()}`,
        structureId,
        createdById: managerId
      },
      select: { id: true }
    })
    supportProgramNameIds.push(programName.id)

    const workshop = await trpc.structureManager.workshop.createWorkshop({
      name: 'Atelier avec dispositif',
      date: new Date(),
      supportProgramNameId: programName.id
    })
    workshopId = workshop.id

    const created = await prismaClient.workshop.findUniqueOrThrow({
      where: { id: workshop.id },
      select: { supportProgramNameId: true }
    })
    expect(created.supportProgramNameId).toBe(programName.id)
  })
})
