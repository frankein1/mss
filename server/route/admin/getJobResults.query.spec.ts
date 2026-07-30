import { describe, expect, beforeEach, afterEach } from 'vitest'
import { test } from '~/test/server/test-utils'
import { prismaClient } from '~/server/prisma'

const jobResultIds: string[] = []

const track = <T extends { id: string }>(result: T) => {
  jobResultIds.push(result.id)
  return result
}

beforeEach(async () => {
  track(
    await prismaClient.jobResult.create({
      data: {
        name: 'data-inclusion-structure-import',
        status: 'Success',
        startDate: new Date()
      }
    })
  )
})

afterEach(async () => {
  if (jobResultIds.length) {
    await prismaClient.jobResult.deleteMany({
      where: { id: { in: jobResultIds } }
    })
    jobResultIds.length = 0
  }
})

describe('Job Results - Get Job Results - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.getJobResults({
        page: 1,
        perPage: 10,
        filters: {},
        orderBy: {}
      })
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('Job Results - Get Job Results - Results', () => {
  test('Administrator can retrieve paginated job results', async ({ trpc }) => {
    const result = await trpc.administrator.admin.getJobResults({
      page: 1,
      perPage: 10,
      filters: {},
      orderBy: {}
    })

    expect(result.jobs).toBeDefined()
    expect(Array.isArray(result.jobs)).toBe(true)
    expect(result.jobs.length).toBeGreaterThan(0)
    expect(typeof result.totalPages).toBe('number')
  })
})
