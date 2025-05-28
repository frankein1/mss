import { describe, expect } from 'vitest'
import { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'

import { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<AppRouter['stat']['getCSPStatsPost']>

type Output = inferProcedureOutput<AppRouter['stat']['getCSPStatsPost']>

const parseStats = (stats: Output) =>
  stats.reduce<Record<string, number>>(
    (acc, { socioProfessionalCategory, _count }) => ({
      ...acc,
      [socioProfessionalCategory || 'Non renseigné']: _count
    }),
    {}
  )

describe('Statistics - Beneficiary - Socio-Professional Category (CSP)', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.structureManager.stat.getCSPStatsPost(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 12,
      'Employed': 1
    })
  })
})
