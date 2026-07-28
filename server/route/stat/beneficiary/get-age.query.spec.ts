import { describe, expect, beforeAll } from 'vitest'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js'
import isBetween from 'dayjs/plugin/isBetween.js'
import { AgeGroup } from '~/client/options'
import type { AppRouter } from '~/server/trpc/routers'

beforeAll(() => {
  dayjs.extend(isBetween)
  dayjs.extend(isSameOrBefore)
  dayjs.extend(isSameOrAfter)
})

type Input = inferProcedureInput<AppRouter['stat']['getAgeStats']>

type Output = inferProcedureOutput<AppRouter['stat']['getAgeStats']>

const parseStats = (stats: Output) =>
  stats.reduce<Record<string, number>>(
    (acc, { ageGroup, _count }) => ({
      ...acc,
      [ageGroup || 'Non renseigné']: _count
    }),
    {}
  )

describe('Statistics - Beneficiary - Age', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.structureManager.stat.getAgeStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 6,
      'less-18': 13,
      '18-24': 1,
      '25-34': 2,
      '35-44': 2,
      '45-54': 1,
      '55-64': 1
    })
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.referent.stat.getAgeStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 3,
      'less-18': 5,
      '18-24': 1,
      '35-44': 2,
      '55-64': 1
    })
  })

  test('should compute stats with beneficiaryStatus filter', async ({
    trpc
  }) => {
    const input: Input = { beneficiaryStatus: 'Active' }

    const stats = await trpc.structureManager.stat.getAgeStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 4,
      'less-18': 13,
      '18-24': 1,
      '25-34': 1,
      '35-44': 1,
      '45-54': 1,
      '55-64': 1
    })
  })

  test('should compute stats with ageGroup filter', async ({ trpc }) => {
    const input: Input = { ageGroup: AgeGroup.Group35_44 }

    const stats = await trpc.structureManager.stat.getAgeStats(input)

    expect(parseStats(stats)).toEqual({
      '35-44': 2
    })
  })

  test('should compute stats with cities filter', async ({ trpc }) => {
    const input: Input = { cities: ['Dijon'] }

    const stats = await trpc.structureManager.stat.getAgeStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 1,
      'less-18': 1,
      '25-34': 1
    })
  })
})
