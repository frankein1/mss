import { describe, expect } from 'vitest'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~~/test/server/test-utils'
import { AgeGroup } from '~~/client/options'
import type { AppRouter } from '~~/server/trpc/routers'

type Input = inferProcedureInput<AppRouter['stat']['getFamilyStats']>

type Output = inferProcedureOutput<AppRouter['stat']['getFamilyStats']>

const parseStats = (stats: Output) =>
  stats.reduce<Record<string, number>>(
    (acc, { familySituation, _count }) => ({
      ...acc,
      [familySituation || 'Non renseigné']: _count
    }),
    {}
  )

describe('Statistics - Beneficiary - Family Situation', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.structureManager.stat.getFamilyStats(input)

    expect(parseStats(stats)).toEqual({
      'CoupleWithChildren': 1,
      'Divorced': 2,
      'Single': 1,
      'Non renseigné': 22
    })
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.referent.stat.getFamilyStats(input)

    expect(parseStats(stats)).toEqual({
      'Divorced': 1,
      'Single': 1,
      'Non renseigné': 10
    })
  })

  test('should compute stats with beneficiaryStatus filter', async ({
    trpc
  }) => {
    const input: Input = { beneficiaryStatus: 'Active' }

    const stats = await trpc.structureManager.stat.getFamilyStats(input)

    expect(parseStats(stats)).toEqual({
      'Divorced': 2,
      'Non renseigné': 20
    })
  })

  test('should compute stats with ageGroup filter', async ({ trpc }) => {
    const input: Input = { ageGroup: AgeGroup.Group35_44 }

    const stats = await trpc.structureManager.stat.getFamilyStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 1,
      'Single': 1
    })
  })

  test('should compute stats with cities filter', async ({ trpc }) => {
    const input: Input = { cities: ['Dijon'] }

    const stats = await trpc.structureManager.stat.getFamilyStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 3
    })
  })
})
