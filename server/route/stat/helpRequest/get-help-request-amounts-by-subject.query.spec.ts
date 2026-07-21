import { describe, expect } from 'vitest'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'

import type { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<
  AppRouter['stat']['getHelpRequestAmountsBySubject']
>

type Output = inferProcedureOutput<
  AppRouter['stat']['getHelpRequestAmountsBySubject']
>

const parseStats = (stats: Output) =>
  stats.reduce<Record<string, number>>(
    (acc, { label, count }) => ({
      ...acc,
      [label]: count
    }),
    {}
  )

describe('Statistics - File Instructions - Amounts delivered by Social Support Subject', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats =
      await trpc.structureManager.stat.getHelpRequestAmountsBySubject(input)

    expect(parseStats(stats)).toEqual({
      'Aides financières remboursables': 8000
    })
  })

  test('should not allow stats computation as a reception agent', async ({
    trpc
  }) => {
    const input: Input = {}

    await expect(() =>
      trpc.receptionAgent.stat.getHelpRequestAmountsBySubject(input)
    ).rejects.toThrow(/not allowed to access route/)
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.referent.stat.getHelpRequestAmountsBySubject(input)

    expect(parseStats(stats)).toEqual({})
  })
})
