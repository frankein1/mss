import { test } from '~/test/server/test-utils'
import { fixtureStructures } from '~/prisma/fixtures'
import { describe, expect, beforeEach, afterEach } from 'vitest'
import { prismaClient } from '~/server/prisma'
import { fakerFR as faker } from '@faker-js/faker'

const partnerIds: string[] = []
const structureId = fixtureStructures[0].id

describe('PartnerOrganization - MakeActive - Authorizations', () => {
  beforeEach(async () => {
    const { id } = await prismaClient.partnerOrganization.create({
      select: { id: true },
      data: {
        id: faker.string.uuid(),
        name: faker.company.name(),
        structureId,
        inactive: true
      }
    })
    partnerIds.push(id)
  })

  afterEach(resetDatabase)

  test('A manager can re-activate a partner organization', async ({ trpc }) => {
    await trpc.structureManager.partner.makeActive({ id: partnerIds[0]! })

    const partner = await prismaClient.partnerOrganization.findUniqueOrThrow({
      where: { id: partnerIds[0] },
      select: { inactive: true }
    })
    expect(partner.inactive).toBe(false)
  })

  test('An agent cannot make a partner from another structure active', async ({
    trpc
  }) => {
    await expect(
      () =>
        partnerIds[0] &&
        trpc.structureManagerMinistere.partner.makeActive({
          id: partnerIds[0]
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
