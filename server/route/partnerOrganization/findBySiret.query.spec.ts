import { describe, expect, beforeEach, afterEach } from 'vitest'
import { prismaClient } from '~~/server/prisma'
import { test } from '~~/test/server/test-utils'
import { fixtureStructures } from '~~/prisma/fixtures'
import { fakerFR as faker } from '@faker-js/faker'

const structureId = fixtureStructures[0].id
const siret = '98765432109876'

const partnerIds: string[] = []

describe('PartnerOrganization - FindBySiret', () => {
  beforeEach(async () => {
    const { id } = await prismaClient.partnerOrganization.create({
      select: { id: true },
      data: {
        id: faker.string.uuid(),
        name: `FBS-${faker.company.name()}`,
        siret,
        structureId
      }
    })
    partnerIds.push(id)
  })

  afterEach(async () => {
    await prismaClient.partnerOrganization.deleteMany({
      where: { id: { in: partnerIds } }
    })
    partnerIds.length = 0
  })

  test('A manager can find a partner organization by SIRET', async ({
    trpc
  }) => {
    const result = await trpc.structureManager.partner.findBySiret({ siret })

    expect(result).not.toBeNull()
    expect(result!.id).toBe(partnerIds[0])
  })

  test('Returns null for an unknown SIRET', async ({ trpc }) => {
    const result = await trpc.structureManager.partner.findBySiret({
      siret: '00000000000000'
    })

    expect(result).toBeNull()
  })

  test('A user from another structure cannot find the partner', async ({
    trpc
  }) => {
    const result = await trpc.structureManagerMinistere.partner.findBySiret({
      siret
    })

    expect(result).toBeNull()
  })

  test('An administrator cannot search by SIRET', async ({ trpc }) => {
    await expect(() =>
      trpc.administrator.partner.findBySiret({ siret })
    ).rejects.toThrow(/user routes are not available to admins/i)
  })
})
