import { describe, expect } from 'vitest'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'

import type { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<AppRouter['stat']['getMobilityStats']>

type Output = inferProcedureOutput<AppRouter['stat']['getMobilityStats']>

const parseStats = (stats: Output) =>
  stats.reduce<Record<string, number>>(
    (acc, { mobility, _count }) => ({
      ...acc,
      [mobility || 'Non renseigné']: _count
    }),
    {}
  )

describe('Statistics - Beneficiary - Mobility', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.structureManager.stat.getMobilityStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 11,
      'BikeOrEquivalent': 1,
      'PublicTransport': 1
    })
  })
})
