import { describe, expect } from 'vitest'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~~/test/server/test-utils'

import type { AppRouter } from '~~/server/trpc/routers'

type Input = inferProcedureInput<AppRouter['stat']['getAccommodationZoneStats']>

type Output = inferProcedureOutput<
  AppRouter['stat']['getAccommodationZoneStats']
>

const parseStats = (stats: Output) =>
  stats.reduce<Record<string, number>>(
    (acc, { accommodationZone, _count }) => ({
      ...acc,
      [accommodationZone || 'Non renseigné']: _count
    }),
    {}
  )

describe('Statistics - Beneficiary - Accommodation Zone', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats =
      await trpc.structureManagerMinistere.stat.getAccommodationZoneStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 1,
      'France': 1,
      'Europe': 1,
      'OutsideEurope': 1
    })
  })

  test('should compute stats with beneficiaryStatus filter', async ({
    trpc
  }) => {
    const input: Input = { beneficiaryStatus: 'Active' }

    const stats =
      await trpc.structureManagerMinistere.stat.getAccommodationZoneStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 1,
      'France': 1,
      'Europe': 1
    })
  })
})
