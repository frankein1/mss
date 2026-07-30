import { describe, expect, afterEach } from 'vitest'
import { test } from '~/test/server/test-utils'
import { prismaClient } from '~/server/prisma'
import { fixtureStructures, FixtureStructure } from '~/prisma/fixtures'

const structureId = fixtureStructures[FixtureStructure.Test].id
const originalValues = {
  name: fixtureStructures[FixtureStructure.Test].name,
  email: fixtureStructures[FixtureStructure.Test].email,
  address: fixtureStructures[FixtureStructure.Test].address,
  city: fixtureStructures[FixtureStructure.Test].city!,
  zipcode: fixtureStructures[FixtureStructure.Test].zipcode!,
  phone: fixtureStructures[FixtureStructure.Test].phone!
}

afterEach(async () => {
  await prismaClient.structure.update({
    where: { id: structureId },
    data: originalValues
  })
})

const input = {
  name: 'Updated Structure Name',
  email: 'updated@test.com',
  address: '42 rue du Test',
  city: 'Testville',
  zipcode: '75001',
  phone: '01 23 45 67 89',
  dpoFirstName: 'Jean',
  dpoLastName: 'DPO',
  dpoEmail: 'dpo@test.com'
}

describe('Structure - Update Info - Authorizations', () => {
  test('A StructureManager can update structure info', async ({ trpc }) => {
    const result =
      await trpc.structureManager.structure.updateStructureInfo(input)
    expect(result.id).toBe(structureId)
  })

  test('A SocialWorker cannot update structure info', async ({ trpc }) => {
    await expect(() =>
      trpc.socialWorker.structure.updateStructureInfo(input)
    ).rejects.toThrow(/not allowed to access route/i)
  })
})

describe('Structure - Update Info - Data', () => {
  test('Happy path updates structure fields', async ({ trpc }) => {
    await trpc.structureManager.structure.updateStructureInfo(input)
    const structure = await prismaClient.structure.findUniqueOrThrow({
      where: { id: structureId }
    })
    expect(structure.name).toBe(input.name)
    expect(structure.email).toBe(input.email)
    expect(structure.city).toBe(input.city)
  })
})
