import { describe, expect } from 'vitest'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'

import type { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<
  AppRouter['stat']['getHelpRequestAmountsByInstructorOrganization']
>

type Output = inferProcedureOutput<
  AppRouter['stat']['getHelpRequestAmountsByInstructorOrganization']
>

const parseStats = (stats: Output) =>
  stats.reduce<Record<string, { count: number; subCount: number }>>(
    (acc, { label, count, subCount }) => ({
      ...acc,
      [label]: { count, subCount }
    }),
    {}
  )

describe('Statistics - File Instructions - Amounts delivered by Instructor Organization', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats =
      await trpc.structureManager.stat.getHelpRequestAmountsByInstructorOrganization(
        input
      )

    expect(parseStats(stats)).toEqual({
      'Mairie de Valence': { count: 5000, subCount: 5000 },
      'Non renseigné': { count: 1000, subCount: 2500 }
    })
  })

  test('should not allow stats computation as a reception agent', async ({
    trpc
  }) => {
    const input: Input = {}

    await expect(() =>
      trpc.receptionAgent.stat.getHelpRequestAmountsByInstructorOrganization(
        input
      )
    ).rejects.toThrow(/not allowed to access route/)
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats =
      await trpc.referent.stat.getHelpRequestAmountsByInstructorOrganization(
        input
      )

    expect(parseStats(stats)).toEqual({
      'Non renseigné': { count: 0, subCount: 1500 }
    })
  })
})
