import { describe, expect } from 'vitest'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'
import { getStatLabel, housingReasonKeys, isFirstKeys } from '~/client/options'
import type { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<
  AppRouter['stat']['getHousingHelpRequestsStats']
>

type Output = inferProcedureOutput<
  AppRouter['stat']['getHousingHelpRequestsStats']
>

const parseStats = (stats: Output) => ({
  housingHelpRequestCount: stats.housingHelpRequestCount,
  housingHelpRequestContextCount: stats.housingHelpRequestContextCount.reduce<
    Record<string, number>
  >((acc, { isFirst, _count }) => {
    const label = getStatLabel(isFirstKeys.byKey, String(isFirst))
    return {
      ...acc,
      ...(label && { [label]: _count })
    }
  }, {}),
  housingHelpRequestReasonCount: stats.housingHelpRequestReasonCount.reduce<
    Record<string, number>
  >((acc, { reason, _count }) => {
    const label = getStatLabel(housingReasonKeys.byKey, String(reason))
    return {
      ...acc,
      ...(label && { [label]: _count })
    }
  }, {})
})

describe('Statistics - File Instructions - Housing Help Requests', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats =
      await trpc.structureManager.stat.getHousingHelpRequestsStats(input)

    expect(parseStats(stats)).toEqual({
      housingHelpRequestCount: 6,
      housingHelpRequestContextCount: {
        '1ère demande': 1,
        'Renouvellement': 1,
        'Non renseigné': 4
      },
      housingHelpRequestReasonCount: {
        'Non renseigné': 5,
        'Divorce ou séparation': 1
      }
    })
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.referent.stat.getHousingHelpRequestsStats(input)

    expect(parseStats(stats)).toEqual({
      housingHelpRequestCount: 2,
      housingHelpRequestContextCount: {
        '1ère demande': 1,
        'Non renseigné': 1
      },
      housingHelpRequestReasonCount: { 'Non renseigné': 2 }
    })
  })
})
