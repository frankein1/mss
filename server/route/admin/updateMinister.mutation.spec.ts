import { describe, expect, afterEach, beforeEach } from 'vitest'
import { test } from '~/test/server/test-utils'
import { prismaClient } from '~/server/prisma'

let ministerId: string

beforeEach(async () => {
  const minister = await prismaClient.ministerEntity.create({
    data: {
      firstName: 'UpdSpec',
      lastName: 'Minister',
      function: 'Solidarités',
      government: 'Gouvernement UpdSpec',
      status: 'Current'
    }
  })
  ministerId = minister.id
})

afterEach(async () => {
  await prismaClient.ministerEntity.deleteMany({
    where: { id: ministerId }
  })
})

describe('Admin - Update Minister - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.updateMinister({
        id: ministerId,
        firstName: 'UpdSpec',
        lastName: 'Minister',
        function: 'Updated',
        government: 'Gouvernement UpdSpec',
        status: 'Current'
      })
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('Admin - Update Minister - Happy path', () => {
  test('An administrator can update a minister', async ({ trpc }) => {
    const result = await trpc.administrator.admin.updateMinister({
      id: ministerId,
      firstName: 'UpdSpec',
      lastName: 'Minister',
      function: 'Éducation',
      government: 'Gouvernement UpdSpec',
      status: 'Former'
    })

    expect(result.id).toBe(ministerId)

    const updated = await prismaClient.ministerEntity.findUniqueOrThrow({
      where: { id: ministerId }
    })
    expect(updated.function).toBe('Éducation')
    expect(updated.status).toBe('Former')
  })
})
