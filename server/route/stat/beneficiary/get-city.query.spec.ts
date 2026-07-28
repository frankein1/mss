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
      'Dijon': 3,
      'Lyon': 4,
      'Paris': 1,
      'Marseille': 1,
      'Toulouse': 1,
      'Bordeaux': 1,
      'Lille': 1,
      'Nantes': 1,
      'Strasbourg': 1,
      'Rennes': 1,
      'Nice': 3
    })
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.referent.stat.getCityStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 6,
      'Dijon': 1,
      'Paris': 1,
      'Toulouse': 1,
      'Lille': 1,
      'Strasbourg': 1,
      'Nice': 1
    })
  })

  test('should compute stats with beneficiaryStatus filter', async ({
    trpc
  }) => {
    const input: Input = { beneficiaryStatus: 'Active' }

    const stats = await trpc.structureManager.stat.getCityStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 7,
      'Dijon': 2,
      'Lyon': 3,
      'Marseille': 1,
      'Toulouse': 1,
      'Bordeaux': 1,
      'Lille': 1,
      'Nantes': 1,
      'Strasbourg': 1,
      'Rennes': 1,
      'Nice': 3
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
      Lyon: 4
    })
  })
})
