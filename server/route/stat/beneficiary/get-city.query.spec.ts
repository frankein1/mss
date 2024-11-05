import { describe, expect } from 'vitest'
import { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'

import { AppRouter } from '~/server/trpc/routers'

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
      'Non renseigné': 10,
      'Dijon': 1
    })
  })
})
