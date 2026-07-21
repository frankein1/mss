import { describe, expect } from 'vitest'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'
import { AgeGroup } from '~/client/options'
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
      'Female': 6,
      'Male': 5,
      'Non renseigné': 4,
      'Other': 1
    })
  })

  test('should not allow stats computation as a reception agent', async ({
    trpc
  }) => {
    const input: Input = {}

    await expect(() =>
      trpc.receptionAgent.stat.getGenderStats(input)
    ).rejects.toThrow(/not allowed to access route/)
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.referent.stat.getGenderStats(input)

    expect(parseStats(stats)).toEqual({
      'Male': 3,
      'Female': 3,
      'Other': 1,
      'Non renseigné': 1
    })
  })

  test('should compute stats with beneficiaryStatus filter', async ({
    trpc
  }) => {
    const input: Input = { beneficiaryStatus: 'Active' }

    const stats = await trpc.structureManager.stat.getGenderStats(input)

    expect(parseStats(stats)).toEqual({
      'Female': 4,
      'Male': 5,
      'Non renseigné': 2,
      'Other': 1
    })
  })

  test('should compute stats with ageGroup filter', async ({ trpc }) => {
    const input: Input = { ageGroup: AgeGroup.Group35_44 }

    const stats = await trpc.structureManager.stat.getGenderStats(input)

    expect(parseStats(stats)).toEqual({
      'Female': 1,
      'Non renseigné': 1
    })
  })

  test('should compute stats with cities filter', async ({ trpc }) => {
    const input: Input = { cities: ['Dijon'] }

    const stats = await trpc.structureManager.stat.getGenderStats(input)

    expect(parseStats(stats)).toEqual({
      'Female': 2,
      'Non renseigné': 1
    })
  })
})
