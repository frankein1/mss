import { describe, expect, afterEach } from 'vitest'
import { test } from '~/test/server/test-utils'
import { prismaClient } from '~/server/prisma'
import { fixtureStructures, FixtureStructure } from '~/prisma/fixtures'

const structure = fixtureStructures[FixtureStructure.Test]

describe('Admin - Update Structure Info - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.updateStructureInfo({
        id: structure.id,
        type: 'Ccas',
        name: structure.name,
        zipcode: structure.zipcode,
        city: structure.city,
        address: structure.address,
        phone: structure.phone,
        email: structure.email,
        dpoFirstName: 'Jean',
        dpoLastName: 'Dupont',
        dpoEmail: 'dpo@test.com'
      })
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('Admin - Update Structure Info - Happy path', () => {
  afterEach(async () => {
    await prismaClient.structure.update({
      where: { id: structure.id },
      data: {
        name: structure.name,
        city: structure.city,
        address: structure.address,
        email: structure.email
      }
    })
  })

  test('An administrator can update structure admin info', async ({ trpc }) => {
    const result = await trpc.administrator.admin.updateStructureInfo({
      id: structure.id,
      type: 'Ccas',
      name: 'Updated Structure Name',
      zipcode: structure.zipcode,
      city: 'Updated City',
      address: '99 rue Updated',
      phone: structure.phone,
      email: 'updated-structure@test.com',
      dpoFirstName: 'Marie',
      dpoLastName: 'Martin',
      dpoEmail: 'dpo-updated@test.com'
    })

    expect(result.id).toBe(structure.id)

    const updated = await prismaClient.structure.findUniqueOrThrow({
      where: { id: structure.id }
    })
    expect(updated.name).toBe('Updated Structure Name')
    expect(updated.city).toBe('Updated City')
    expect(updated.address).toBe('99 rue Updated')
    expect(updated.email).toBe('updated-structure@test.com')
  })
})
