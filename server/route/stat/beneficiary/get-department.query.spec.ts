import { describe, expect } from 'vitest'
import { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'

import { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<AppRouter['stat']['getDepartmentStats']>

type Output = inferProcedureOutput<AppRouter['stat']['getDepartmentStats']>

const parseStats = (stats: Output) =>
  stats.reduce<Record<string, number>>(
    (acc, { department, _count }) => ({
      ...acc,
      [department || 'Non renseigné']: _count
    }),
    {}
  )

describe('Statistics - Beneficiary - Department', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.structureManager.stat.getDepartmentStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 10,
      "Côte-d'Or": 1
    })
  })
})
