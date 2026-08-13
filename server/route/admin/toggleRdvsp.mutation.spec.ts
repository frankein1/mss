import { describe, expect, afterEach } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { prismaClient } from '~~/server/prisma'
import { fixtureStructures, FixtureStructure } from '~~/prisma/fixtures'

const structure = fixtureStructures[FixtureStructure.Test]

describe('Admin - Toggle Rdvsp - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.toggleRdvsp({
        id: structure.id,
        externalRdvspActive: true
      })
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('Admin - Toggle Rdvsp - Happy path', () => {
  let originalValue: boolean

  afterEach(async () => {
    await prismaClient.structure.update({
      where: { id: structure.id },
      data: { externalRdvspActive: originalValue }
    })
  })

  test('An administrator can toggle externalRdvspActive on a structure', async ({
    trpc
  }) => {
    const current = await prismaClient.structure.findUniqueOrThrow({
      where: { id: structure.id },
      select: { externalRdvspActive: true }
    })
    originalValue = current.externalRdvspActive!

    const newValue = !originalValue

    await trpc.administrator.admin.toggleRdvsp({
      id: structure.id,
      externalRdvspActive: newValue
    })

    const updated = await prismaClient.structure.findUniqueOrThrow({
      where: { id: structure.id },
      select: { externalRdvspActive: true }
    })
    expect(updated.externalRdvspActive).toBe(newValue)
  })
})
