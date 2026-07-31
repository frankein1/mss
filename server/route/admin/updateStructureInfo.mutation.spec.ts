import { describe, expect, beforeEach, afterEach } from 'vitest'
import { test } from '~/test/server/test-utils'
import { prismaClient } from '~/server/prisma'

const PREFIX = 'USI-'
let structureId: string

beforeEach(async () => {
  const structure = await prismaClient.structure.create({
    data: {
      name: `${PREFIX}Structure`,
      type: 'Ccas',
      address: '1 rue Test',
      city: 'Testville',
      zipcode: '00000',
      phone: '01 00 00 00 00',
      email: `${PREFIX}structure@test.com`
    }
  })
  structureId = structure.id
})

afterEach(async () => {
  await prismaClient.structure.deleteMany({
    where: { name: { startsWith: PREFIX } }
  })
})

describe('Admin - Update Structure Info - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.updateStructureInfo({
        id: structureId,
        type: 'Ccas',
        name: `${PREFIX}Structure`,
        zipcode: '00000',
        city: 'Testville',
        address: '1 rue Test',
        phone: '01 00 00 00 00',
        email: `${PREFIX}structure@test.com`,
        dpoFirstName: 'Jean',
        dpoLastName: 'Dupont',
        dpoEmail: 'dpo@test.com'
      })
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('Admin - Update Structure Info - Happy path', () => {
  test('An administrator can update structure admin info', async ({ trpc }) => {
    const result = await trpc.administrator.admin.updateStructureInfo({
      id: structureId,
      type: 'Ccas',
      name: `${PREFIX}Updated Name`,
      zipcode: '00000',
      city: `${PREFIX}Updated City`,
      address: '99 rue Updated',
      phone: '01 00 00 00 00',
      email: `${PREFIX}updated@test.com`,
      dpoFirstName: 'Marie',
      dpoLastName: 'Martin',
      dpoEmail: 'dpo-updated@test.com'
    })

    expect(result.id).toBe(structureId)

    const updated = await prismaClient.structure.findUniqueOrThrow({
      where: { id: structureId }
    })
    expect(updated.name).toBe(`${PREFIX}Updated Name`)
    expect(updated.city).toBe(`${PREFIX}Updated City`)
    expect(updated.address).toBe('99 rue Updated')
    expect(updated.email).toBe(`${PREFIX}updated@test.com`)
  })
})
