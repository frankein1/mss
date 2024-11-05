import { describe, expect } from 'vitest'
import { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'

import { AppRouter } from '~/server/trpc/routers'

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
      'Non renseigné': 8
    })
  })
})
