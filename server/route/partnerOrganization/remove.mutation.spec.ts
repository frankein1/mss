import { test } from '~/test/server/test-utils'
import { fixtureStructures } from '~/prisma/fixtures'
import { describe, expect, beforeEach, afterEach } from 'vitest'
import { prismaClient } from '~/server/prisma'
import { fakerFR as faker } from '@faker-js/faker'

const partnerIds: string[] = []
const structureId = fixtureStructures[0].id

describe('PartnerOrganization - Remove - Authorizations', () => {
  beforeEach(async () => {
    const { id } = await prismaClient.partnerOrganization.create({
      select: { id: true },
      data: {
        id: faker.string.uuid(),
        name: faker.company.name(),
        structureId
      }
    })
    partnerIds.push(id)
  })

  afterEach(resetDatabase)

  test('A manager can deactivate a partner organization', async ({ trpc }) => {
    await trpc.structureManager.partner.remove({ id: partnerIds[0]! })

    const partner = await prismaClient.partnerOrganization.findUniqueOrThrow({
      where: { id: partnerIds[0] },
      select: { inactive: true }
    })
    expect(partner.inactive).toBe(true)
  })

  test('A social worker can deactivate a partner organization', async ({
    trpc
  }) => {
    await trpc.socialWorker.partner.remove({ id: partnerIds[0]! })

    const partner = await prismaClient.partnerOrganization.findUniqueOrThrow({
      where: { id: partnerIds[0] },
      select: { inactive: true }
    })
    expect(partner.inactive).toBe(true)
  })

  test('A referent cannot deactivate a partner organization', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.referent.partner.remove({ id: partnerIds[0]! })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('An instructor cannot deactivate a partner organization', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.instructor.partner.remove({ id: partnerIds[0]! })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('A reception agent cannot deactivate a partner organization', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.receptionAgent.partner.remove({ id: partnerIds[0]! })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('An agent cannot deactivate a partner from another structure', async ({
    trpc
  }) => {
    await expect(
      () =>
        partnerIds[0] &&
        trpc.structureManagerMinistere.partner.remove({ id: partnerIds[0] })
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
