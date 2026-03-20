import { describe, expect } from 'vitest'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'

import type { AppRouter } from '~/server/trpc/routers'

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
      'Non renseigné': 10
    })
  })

  test('should not allow stats computation as a reception agent', async ({
    trpc
  }) => {
    const input: Input = {}

    await expect(() =>
      trpc.receptionAgent.stat.getFamilyStats(input)
    ).rejects.toThrowError(/not allowed to access route/)
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.referent.stat.getFamilyStats(input)

    expect(parseStats(stats)).toEqual({
      'Divorced': 1,
      'Non renseigné': 6
    })
  })

  test('should compute stats with beneficiaryStatus filter', async ({
    trpc
  }) => {
    const input: Input = { beneficiaryStatus: 'Active' }

    const stats = await trpc.structureManager.stat.getFamilyStats(input)

    expect(parseStats(stats)).toEqual({
      'Divorced': 2,
      'Non renseigné': 7
    })
  })
})
