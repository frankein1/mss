import { test } from '~/test/server/test-utils'
import { fixtureStructures } from '~/prisma/fixtures'
import { describe, expect, beforeEach, afterEach } from 'vitest'
import { prismaClient } from '~/server/prisma'
import { fakerFR as faker } from '@faker-js/faker'

const partnerIds: string[] = []
const structureId = fixtureStructures[0].id
// const structureIdMinistere = fixtureStructures[2].id

describe('Authorizations', () => {
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

  test('Partner Organization - Make Active - An agent cannot update a partner from another structure', async ({
    trpc
  }) => {
    await expect(
      () =>
        partnerIds[0] &&
        trpc.structureManagerMinistere.partner.update({
          id: partnerIds[0],
          name: 'updated name',
          siret: '12345678901234'
        })
    ).rejects.toThrowError(
      /invalid(.*)prisma.partnerOrganization[\s\S]*?no record/im
    )
  })
})

async function resetDatabase() {
  await prismaClient.partnerOrganization.deleteMany({
    where: { id: { in: partnerIds } }
  })
}
