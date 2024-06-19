import { describe, expect } from 'vitest'
import { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'

import { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<
  AppRouter['stat']['getHelpRequestPrescribingOrganizationStats']
>

type Output = inferProcedureOutput<
  AppRouter['stat']['getHelpRequestPrescribingOrganizationStats']
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
      await trpc.structureManager.stat.getHelpRequestPrescribingOrganizationStats(
        input
      )

    expect(parseStats(stats)).toEqual({
      'Mairie de Valence': 2,
      'CAF 26': 1,
      'Non renseigné': 3
    })
  })

  test('should not allow stats computation as a reception agent', async ({
    trpc
  }) => {
    const input: Input = {}

    await expect(() =>
      trpc.receptionAgent.stat.getHelpRequestPrescribingOrganizationStats(input)
    ).rejects.toThrowError(/not allowed to access route/)
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats =
      await trpc.referent.stat.getHelpRequestPrescribingOrganizationStats(input)

    expect(parseStats(stats)).toEqual({ 'Non renseigné': 2 })
  })
})
