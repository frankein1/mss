import { prismaClient } from '~/server/prisma'
import { afterEach, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import { fixtureStructures, FixtureStructure } from '~/prisma/fixtures'

let workshopId: string
let otherPartnerOrganizationId: string

afterEach(
  async () => await resetDatabase(workshopId, otherPartnerOrganizationId)
)

test('Workshop - Create - An Agent cannot create a workshop with a partner organisation from another structure', async ({
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
  ).rejects.toThrowError(/not allowed to access route/i)
})

test('Workshop - Create - A reception agent can create a workshop and only the id of the created entity is returned', async ({
  trpc
}) => {
  const workshop = await trpc.receptionAgent.workshop.createWorkshop({
    name: 'Atelier Numérique',
    date: new Date()
  })

  workshopId = workshop.id
  expect(workshop).toStrictEqual({ id: workshopId })
})

test('Workshop - Create - An administrator cannot create a workshop', async ({
  trpc
}) => {
  await expect(() =>
    trpc.administrator.workshop.createWorkshop({
      name: 'Atelier Numérique',
      date: new Date()
    })
  ).rejects.toThrowError(/user routes are not available to admins/i)
})

async function resetDatabase(wid: string, poid: string) {
  if (wid) {
    await prismaClient.workshop.deleteMany({ where: { id: wid } })
  }
  if (poid) {
    await prismaClient.partnerOrganization.deleteMany({ where: { id: poid } })
  }
}
