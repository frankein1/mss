import { describe, expect } from 'vitest'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~~/test/server/test-utils'
import { AgeGroup } from '~~/client/options'
import type { AppRouter } from '~~/server/trpc/routers'

type Input = inferProcedureInput<AppRouter['stat']['getSchoolClassStats']>

type Output = inferProcedureOutput<AppRouter['stat']['getSchoolClassStats']>

const parseStats = (stats: Output) =>
  stats.reduce<Record<string, number>>(
    (acc, { schoolClass, _count }) => ({
      ...acc,
      [schoolClass || 'Non renseigné']: _count
    }),
    {}
  )

describe('Statistics - Beneficiary - School Class', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.structureManager.stat.getSchoolClassStats(input)

    expect(parseStats(stats)).toEqual({
      'CM2': 4,
      'CE1': 2,
      'CP': 1,
      'SecondePro': 1,
      'Troisieme': 1,
      'CM1': 1,
      'SecondeGenerale': 1,
      'Sixieme': 1,
      'GrandeSection': 1,
      'Non renseigné': 13
    })
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.referent.stat.getSchoolClassStats(input)

    expect(parseStats(stats)).toEqual({
      'CM2': 2,
      'CP': 1,
      'Sixieme': 1,
      'SecondeGenerale': 1,
      'Non renseigné': 7
    })
  })

  test('should compute stats with beneficiaryStatus filter', async ({
    trpc
  }) => {
    const input: Input = { beneficiaryStatus: 'Active' }

    const stats = await trpc.structureManager.stat.getSchoolClassStats(input)

    expect(parseStats(stats)).toEqual({
      'CM2': 4,
      'CE1': 2,
      'CP': 1,
      'SecondePro': 1,
      'Troisieme': 1,
      'CM1': 1,
      'SecondeGenerale': 1,
      'Sixieme': 1,
      'GrandeSection': 1,
      'Non renseigné': 9
    })
  })

  test('should compute stats with ageGroup filter', async ({ trpc }) => {
    const input: Input = { ageGroup: AgeGroup.Group35_44 }

    const stats = await trpc.structureManager.stat.getSchoolClassStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 2
    })
  })

  test('should compute stats with cities filter', async ({ trpc }) => {
    const input: Input = { cities: ['Nice'] }

    const stats = await trpc.structureManager.stat.getSchoolClassStats(input)

    expect(parseStats(stats)).toEqual({
      CM2: 2,
      CE1: 1
    })
  })
})
