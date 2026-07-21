import { test } from '~/test/server/test-utils'
import { fixtureStructures } from '~/prisma/fixtures'
import { describe, expect, beforeEach, afterEach } from 'vitest'
import { prismaClient } from '~/server/prisma'
import { fakerFR as faker } from '@faker-js/faker'

const partnerIds: string[] = []
const structureId = fixtureStructures[0].id

describe('Authorizations', () => {
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

  test('Partner Organization - Remove - An agent cannot deactivate a partner from another structure', async ({
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
}
