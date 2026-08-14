import { test } from '~~/test/server/test-utils'
import { fixtureStructures } from '~~/prisma/fixtures'
import { describe, expect, beforeEach, afterEach } from 'vitest'
import { prismaClient } from '~~/server/prisma'
import { fakerFR as faker } from '@faker-js/faker'

const partnerIds: string[] = []
const structureId = fixtureStructures[0].id

describe('PartnerOrganization - Update - Authorizations', () => {
  beforeEach(async () => {
    const id = faker.string.uuid()
    const contactIds = new Array(5).fill(null).map(() => faker.string.uuid())
    await prismaClient.partnerOrganization.create({
      select: { id: true },
      data: {
        id,
        name: faker.company.name(),
        structureId,
        contacts: {
          create: contactIds.map(id => ({
            id,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number()
          }))
        }
      }
    })
    partnerIds.push(id)
  })

  afterEach(resetDatabase)

  test('A manager can update a partner organization', async ({ trpc }) => {
    const updatedName = 'UPD-Manager Updated'
    await trpc.structureManager.partner.update({
      id: partnerIds[0]!,
      dataSource: 'Custom' as const,
      name: updatedName,
      siret: '12345678901234'
    })

    const partner = await prismaClient.partnerOrganization.findUniqueOrThrow({
      where: { id: partnerIds[0] },
      select: { name: true }
    })
    expect(partner.name).toBe(updatedName)
  })

  test('A social worker can update a partner organization', async ({
    trpc
  }) => {
    const updatedName = 'UPD-SocialWorker Updated'
    await trpc.socialWorker.partner.update({
      id: partnerIds[0]!,
      dataSource: 'Custom' as const,
      name: updatedName,
      siret: '12345678901234'
    })

    const partner = await prismaClient.partnerOrganization.findUniqueOrThrow({
      where: { id: partnerIds[0] },
      select: { name: true }
    })
    expect(partner.name).toBe(updatedName)
  })

  test('An agent cannot update a partner from another structure', async ({
    trpc
  }) => {
    await expect(
      () =>
        partnerIds[0] &&
        trpc.structureManagerMinistere.partner.update({
          id: partnerIds[0],
          dataSource: 'Custom' as const,
          name: 'updated name',
          siret: '12345678901234'
        })
    ).rejects.toThrow(
      /invalid(.*)prisma.partnerOrganization[\s\S]*?no record/im
    )
  })
})

async function resetDatabase() {
  await prismaClient.partnerOrganization.deleteMany({
    where: { id: { in: partnerIds } }
  })
  partnerIds.length = 0
}
