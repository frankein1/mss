import { describe, expect } from 'vitest'
import { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'

import { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<AppRouter['stat']['getAccommodationModeStats']>

type Output = inferProcedureOutput<
  AppRouter['stat']['getAccommodationModeStats']
>

const parseStats = (stats: Output) =>
  stats.reduce<Record<string, number>>(
    (acc, { accommodationMode, _count }) => ({
      ...acc,
      [accommodationMode || 'Non renseigné']: _count
    }),
    {}
  )

describe('Statistics - Beneficiary - Accomodation Mode', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats =
      await trpc.structureManager.stat.getAccommodationModeStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 10,
      'PrivateRenting': 1,
      'ThirdPerson': 1
    })
  })

  test('should not allow stats computation as a reception agent', async ({
    trpc
  }) => {
    const input: Input = {}

    await expect(() =>
      trpc.receptionAgent.stat.getAccommodationModeStats(input)
    ).rejects.toThrowError(/not allowed to access route/)
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.referent.stat.getAccommodationModeStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 5,
      'ThirdPerson': 1
    })
  })
})
