import { describe, expect } from 'vitest'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'

import type { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<AppRouter['stat']['getAgeStats']>

type Output = inferProcedureOutput<AppRouter['stat']['getAgeStats']>

const parseStats = (stats: Output) =>
  stats.reduce<Record<string, number>>(
    (acc, { ageGroup, _count }) => ({
      ...acc,
      [ageGroup || 'Non renseigné']: _count
    }),
    {}
  )

describe('Statistics - Beneficiary - Age', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.structureManager.stat.getAgeStats(input)

    const parsed = parseStats(stats)

    expect(parsed['Non renseigné']).toBe(6)

    const withAge = stats.filter(s => s.ageGroup !== null)
    const totalWithAge = withAge.reduce((sum, s) => sum + s._count, 0)
    expect(totalWithAge).toBe(7)
  })

  test('should not allow stats computation as a reception agent', async ({
    trpc
  }) => {
    const input: Input = {}

    await expect(() =>
      trpc.receptionAgent.stat.getAgeStats(input)
    ).rejects.toThrowError(/not allowed to access route/)
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.referent.stat.getAgeStats(input)

    const parsed = parseStats(stats)

    expect(parsed['Non renseigné']).toBe(3)

    const withAge = stats.filter(s => s.ageGroup !== null)
    const totalWithAge = withAge.reduce((sum, s) => sum + s._count, 0)
    expect(totalWithAge).toBe(4)
  })

  test('should compute stats with beneficiaryStatus filter', async ({
    trpc
  }) => {
    const input: Input = { beneficiaryStatus: 'Active' }

    const stats = await trpc.structureManager.stat.getAgeStats(input)

    const parsed = parseStats(stats)

    expect(parsed['Non renseigné']).toBe(5)

    const withAge = stats.filter(s => s.ageGroup !== null)
    const totalWithAge = withAge.reduce((sum, s) => sum + s._count, 0)
    expect(totalWithAge).toBe(4)
  })

  test('should compute stats with cities filter', async ({ trpc }) => {
    const input: Input = { cities: ['Dijon'] }

    const stats = await trpc.structureManager.stat.getAgeStats(input)

    const total = stats.reduce((sum, s) => sum + s._count, 0)
    expect(total).toBe(2)
    expect(stats.every(s => s.ageGroup !== null)).toBe(true)
  })
})
