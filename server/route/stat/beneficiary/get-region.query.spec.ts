import { describe, expect } from 'vitest'
import { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'

import { AppRouter } from '~/server/trpc/routers'

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
      'Non renseigné': 11,
      'Bourgogne-Franche-Comté': 1
    })
  })
})
