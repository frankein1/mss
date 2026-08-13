import { describe, expect } from 'vitest'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~~/test/server/test-utils'

import type { AppRouter } from '~~/server/trpc/routers'

type Input = inferProcedureInput<
  AppRouter['stat']['getFollowupPrescribingOrganizationStats']
>

type Output = inferProcedureOutput<
  AppRouter['stat']['getFollowupPrescribingOrganizationStats']
>

const parseStats = (stats: Output) =>
  stats.reduce<Record<string, number>>(
    (acc, { prescribingOrganization, _count }) => ({
      ...acc,
      [prescribingOrganization]: _count
    }),
    {}
  )

describe('Statistics - File Instructions - Prescribing Organization', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats =
      await trpc.structureManager.stat.getFollowupPrescribingOrganizationStats(
        input
      )

    expect(parseStats(stats)).toEqual({ 'Non renseigné': 6 })
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats =
      await trpc.referent.stat.getFollowupPrescribingOrganizationStats(input)

    expect(parseStats(stats)).toEqual({ 'Non renseigné': 2 })
  })
})
