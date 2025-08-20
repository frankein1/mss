import { describe, expect } from 'vitest'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'

import type { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<AppRouter['stat']['getGenderStats']>

type Output = inferProcedureOutput<AppRouter['stat']['getGenderStats']>

const parseStats = (stats: Output) =>
  stats.reduce<Record<string, number>>(
    (acc, { gender, _count }) => ({
      ...acc,
      [gender || 'Non renseigné']: _count
    }),
    {}
  )

describe('Statistics - Beneficiary - Gender', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.structureManager.stat.getGenderStats(input)

    expect(parseStats(stats)).toEqual({
      'Female': 5,
      'Male': 3,
      'Non renseigné': 4,
      'Other': 1
    })
  })
})
