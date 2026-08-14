import { describe, expect, afterEach, beforeEach } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { prismaClient } from '~~/server/prisma'

const createdIds: string[] = []

const track = <T extends { id: string }>(result: T) => {
  createdIds.push(result.id)
  return result
}

beforeEach(async () => {
  await prismaClient.ministerEntity.deleteMany({
    where: { firstName: 'Spec', lastName: 'Minister' }
  })
})

afterEach(async () => {
  if (createdIds.length) {
    await prismaClient.ministerEntity.deleteMany({
      where: { id: { in: createdIds } }
    })
    createdIds.length = 0
  }
})

const validInput = {
  firstName: 'Spec',
  lastName: 'Minister',
  function: 'Solidarités',
  government: 'Gouvernement Spec',
  status: 'Current' as const
}

describe('Admin - Create Minister - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.createMinister(validInput)
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('Admin - Create Minister - Happy path', () => {
  test('An administrator can create a minister', async ({ trpc }) => {
    const result = track(
      await trpc.administrator.admin.createMinister(validInput)
    )

    expect(result.id).toBeDefined()

    const minister = await prismaClient.ministerEntity.findUniqueOrThrow({
      where: { id: result.id }
    })
    expect(minister.firstName).toBe('Spec')
    expect(minister.lastName).toBe('Minister')
    expect(minister.function).toBe('Solidarités')
    expect(minister.government).toBe('Gouvernement Spec')
    expect(minister.status).toBe('Current')
  })
})
