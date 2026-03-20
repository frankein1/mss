import { describe, expect } from 'vitest'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'

import type { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<AppRouter['stat']['getRegionStats']>

type Output = inferProcedureOutput<AppRouter['stat']['getRegionStats']>

const parseStats = (stats: Output) =>
  stats.reduce<Record<string, number>>(
    (acc, { region, _count }) => ({
      ...acc,
      [region || 'Non renseigné']: _count
    }),
    {}
  )

describe('Statistics - Beneficiary - Region', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.structureManager.stat.getRegionStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 10,
      'Bourgogne-Franche-Comté': 2,
      'Île-de-France': 1
    })
  })

  test('should not allow stats computation as a reception agent', async ({
    trpc
  }) => {
    const input: Input = {}

    await expect(() =>
      trpc.receptionAgent.stat.getRegionStats(input)
    ).rejects.toThrowError(/not allowed to access route/)
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.referent.stat.getRegionStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 6,
      'Île-de-France': 1
    })
  })

  test('should compute stats with beneficiaryStatus filter', async ({
    trpc
  }) => {
    const input: Input = { beneficiaryStatus: 'Active' }

    const stats = await trpc.structureManager.stat.getRegionStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 8,
      'Bourgogne-Franche-Comté': 1
    })
  })

  test('should compute stats with ageGroup filter', async ({ trpc }) => {
    const input: Input = { ageGroup: '35-44' }

    const stats = await trpc.structureManager.stat.getRegionStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 1,
      'Île-de-France': 1
    })
  })

  test('should compute stats with cities filter', async ({ trpc }) => {
    const input: Input = { cities: ['Dijon'] }

    const stats = await trpc.structureManager.stat.getRegionStats(input)

    expect(parseStats(stats)).toEqual({
      'Bourgogne-Franche-Comté': 2
    })
  })
})
