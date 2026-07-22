import { describe, expect } from 'vitest'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'
import { AgeGroup } from '~/client/options'
import type { AppRouter } from '~/server/trpc/routers'

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
      'Non renseigné': 24,
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
    ).rejects.toThrow(/not allowed to access route/)
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.referent.stat.getAccommodationModeStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 11,
      'ThirdPerson': 1
    })
  })

  test('should compute stats with beneficiaryStatus filter', async ({
    trpc
  }) => {
    const input: Input = { beneficiaryStatus: 'Active' }

    const stats =
      await trpc.structureManager.stat.getAccommodationModeStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 21,
      'ThirdPerson': 1
    })
  })

  test('should compute stats with ageGroup filter', async ({ trpc }) => {
    const input: Input = { ageGroup: AgeGroup.Group35_44 }

    const stats =
      await trpc.structureManager.stat.getAccommodationModeStats(input)

    expect(parseStats(stats)).toEqual({
      'ThirdPerson': 1,
      'Non renseigné': 1
    })
  })

  test('should compute stats with cities filter', async ({ trpc }) => {
    const input: Input = { cities: ['Dijon'] }

    const stats =
      await trpc.structureManager.stat.getAccommodationModeStats(input)

    expect(parseStats(stats)).toEqual({
      'PrivateRenting': 1,
      'Non renseigné': 2
    })
  })
})
