import { describe, expect } from 'vitest'
import { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'

import { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<
  AppRouter['stat']['getFollowupActionsEntreprisesStats']
>

type Output = inferProcedureOutput<
  AppRouter['stat']['getFollowupActionsEntreprisesStats']
>

const parseStats = (stats: Output) =>
  stats.reduce<Record<string, number>>(
    (acc, { actionEntreprise, _count }) => ({
      ...acc,
      [actionEntreprise]: _count
    }),
    {}
  )

describe('Statistics - Followup - Actions Entreprises', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats =
      await trpc.structureManager.stat.getFollowupActionsEntreprisesStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 6,
      'Instruction': 0,
      'Réorientation': 0
    })
  })

  test('should not allow stats computation as a reception agent', async ({
    trpc
  }) => {
    const input: Input = {}

    await expect(() =>
      trpc.receptionAgent.stat.getFollowupActionsEntreprisesStats(input)
    ).rejects.toThrowError(/not allowed to access route/)
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats =
      await trpc.referent.stat.getFollowupActionsEntreprisesStats(input)

    expect(parseStats(stats)).toEqual({
      'Non renseigné': 2,
      'Instruction': 0,
      'Réorientation': 0
    })
  })
})
