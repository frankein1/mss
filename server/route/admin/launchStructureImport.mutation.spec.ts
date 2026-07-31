import { describe, expect, afterEach, beforeEach } from 'vitest'
import { test } from '~/test/server/test-utils'
import { prismaClient } from '~/server/prisma'

const createdIds: string[] = []

const track = <T extends { id: string }>(result: T) => {
  createdIds.push(result.id)
  return result
}

afterEach(async () => {
  if (createdIds.length) {
    await prismaClient.jobResult.deleteMany({
      where: { id: { in: createdIds } }
    })
    createdIds.length = 0
  }
})

describe('Admin - Launch Structure Import - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.launchStructureImport()
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('Admin - Launch Structure Import - Happy path', () => {
  test('An administrator can launch an import when no ongoing job', async ({
    trpc
  }) => {
    const result = await trpc.administrator.admin.launchStructureImport()

    expect(result).toBe(true)
  })
})

describe('Admin - Launch Structure Import - Ongoing job', () => {
  beforeEach(async () => {
    const job = await prismaClient.jobResult.create({
      data: {
        name: 'data-inclusion-import',
        status: 'Ongoing'
      }
    })
    track(job)
  })

  test('An administrator gets false when a job is already running', async ({
    trpc
  }) => {
    const result = await trpc.administrator.admin.launchStructureImport()

    expect(result).toBe(false)
  })
})
