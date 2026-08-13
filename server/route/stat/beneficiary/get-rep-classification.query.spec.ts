import { describe, expect } from 'vitest'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~~/test/server/test-utils'
import type { AppRouter } from '~~/server/trpc/routers'

type Input = inferProcedureInput<AppRouter['stat']['getRepClassificationStats']>

type Output = inferProcedureOutput<
  AppRouter['stat']['getRepClassificationStats']
>

const parseStats = (stats: Output) =>
  stats.reduce<Record<string, number>>(
    (acc, { repClassification, _count }) => ({
      ...acc,
      [repClassification]: _count
    }),
    {}
  )

describe('Statistics - Beneficiary - REP Classification', () => {
  test('should compute stats as a structure manager with no filters, counting all beneficiaries', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats =
      await trpc.structureManager.stat.getRepClassificationStats(input)

    expect(parseStats(stats)).toEqual({
      Rep: 2,
      RepPlus: 3,
      NonRep: 8,
      SchoolNotFilled: 13
    })
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.referent.stat.getRepClassificationStats(input)

    expect(parseStats(stats)).toEqual({
      Rep: 1,
      NonRep: 4,
      SchoolNotFilled: 7
    })
  })

  test('should compute stats with cities filter', async ({ trpc }) => {
    const input: Input = { cities: ['Nice'] }

    const stats =
      await trpc.structureManager.stat.getRepClassificationStats(input)

    expect(parseStats(stats)).toEqual({
      NonRep: 3
    })
  })

  test('should compute stats with beneficiaryStatus filter', async ({
    trpc
  }) => {
    const input: Input = { beneficiaryStatus: 'Active' }

    const stats =
      await trpc.structureManager.stat.getRepClassificationStats(input)

    expect(parseStats(stats)).toEqual({
      Rep: 2,
      RepPlus: 3,
      NonRep: 8,
      SchoolNotFilled: 9
    })
  })
})
