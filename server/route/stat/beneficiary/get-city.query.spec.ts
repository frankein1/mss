import { describe, expect } from 'vitest'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'
import { AgeGroup } from '~/client/options'
import type { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<AppRouter['stat']['getCityStats']>

type Output = inferProcedureOutput<AppRouter['stat']['getCityStats']>

const parseStats = (stats: Output) =>
  stats.reduce<Record<string, number>>(
    (acc, { city, _count }) => ({
      ...acc,
      [city || 'Non renseigné']: _count
    }),
    {}
  )

describe('Statistics - Beneficiary - City', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.structureManager.stat.getCityStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 8,
      'Dijon': 2,
      'Lyon': 2,
      'Paris': 1
    })
  })

  test('should not allow stats computation as a reception agent', async ({
    trpc
  }) => {
    const input: Input = {}

    await expect(() =>
      trpc.receptionAgent.stat.getCityStats(input)
    ).rejects.toThrow(/not allowed to access route/)
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.referent.stat.getCityStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 6,
      'Paris': 1
    })
  })

  test('should compute stats with beneficiaryStatus filter', async ({
    trpc
  }) => {
    const input: Input = { beneficiaryStatus: 'Active' }

    const stats = await trpc.structureManager.stat.getCityStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 7,
      'Dijon': 1,
      'Lyon': 1
    })
  })

  test('should compute stats with ageGroup filter', async ({ trpc }) => {
    const input: Input = { ageGroup: AgeGroup.Group35_44 }

    const stats = await trpc.structureManager.stat.getCityStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 1,
      'Paris': 1
    })
  })

  test('should compute stats with cities filter', async ({ trpc }) => {
    const input: Input = { cities: ['Lyon'] }

    const stats = await trpc.structureManager.stat.getCityStats(input)

    expect(parseStats(stats)).toEqual({
      Lyon: 2
    })
  })
})
