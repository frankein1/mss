import { describe, expect } from 'vitest'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'
import { AgeGroup } from '~/client/options'
import type { AppRouter } from '~/server/trpc/routers'

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
      "Côte-d'Or": 2,
      'Val-de-Marne': 1
    })
  })

  test('should not allow stats computation as a reception agent', async ({
    trpc
  }) => {
    const input: Input = {}

    await expect(() =>
      trpc.receptionAgent.stat.getDepartmentStats(input)
    ).rejects.toThrow(/not allowed to access route/)
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.referent.stat.getDepartmentStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 6,
      'Val-de-Marne': 1
    })
  })

  test('should compute stats with beneficiaryStatus filter', async ({
    trpc
  }) => {
    const input: Input = { beneficiaryStatus: 'Active' }

    const stats = await trpc.structureManager.stat.getDepartmentStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 8,
      "Côte-d'Or": 1
    })
  })

  test('should compute stats with ageGroup filter', async ({ trpc }) => {
    const input: Input = { ageGroup: AgeGroup.Group35_44 }

    const stats = await trpc.structureManager.stat.getDepartmentStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 1,
      'Val-de-Marne': 1
    })
  })

  test('should compute stats with cities filter', async ({ trpc }) => {
    const input: Input = { cities: ['Dijon'] }

    const stats = await trpc.structureManager.stat.getDepartmentStats(input)

    expect(parseStats(stats)).toEqual({
      "Côte-d'Or": 2
    })
  })
})
