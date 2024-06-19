import { describe, expect } from 'vitest'
import { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'

import { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<
  AppRouter['stat']['getFinancialHelpRequestsStats']
>

type Output = inferProcedureOutput<
  AppRouter['stat']['getFinancialHelpRequestsStats']
>

const parseStats = (stats: Output) => ({
  financialHelpRequestAmountByType:
    stats.financialHelpRequestAmountByType.reduce<Record<string, number>>(
      (acc, { allocatedAmount, type }) => ({
        ...acc,
        [type.name]: allocatedAmount
      }),
      {}
    ),
  financialHelpRequestCounts: stats.financialHelpRequestCounts.reduce<
    Record<string, number>
  >(
    (acc, { label, count }) => ({
      ...acc,
      [label]: count
    }),
    {}
  ),
  financialHelpRequestTotalAmount: stats.financialHelpRequestTotalAmount
})

describe('Statistics - File Instructions - Financial Help Requests', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats =
      await trpc.structureManager.stat.getFinancialHelpRequestsStats(input)

    expect(parseStats(stats)).toEqual({
      financialHelpRequestAmountByType: {
        'Aides financières remboursables': 8000 // amount for *successful* file instructions
      },
      financialHelpRequestCounts: {
        "Nombre d'instructions": 4,
        'Instruites en externe': 3,
        'Instruites en interne': 1
      },
      financialHelpRequestTotalAmount: 2000 // amount for successful *internal* file instructions
    })
  })

  test('should not allow stats computation as a reception agent', async ({
    trpc
  }) => {
    const input: Input = {}

    await expect(() =>
      trpc.receptionAgent.stat.getFinancialHelpRequestsStats(input)
    ).rejects.toThrowError(/not allowed to access route/)
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.referent.stat.getFinancialHelpRequestsStats(input)

    expect(parseStats(stats)).toEqual({
      financialHelpRequestAmountByType: {},
      financialHelpRequestCounts: {
        "Nombre d'instructions": 1,
        'Instruites en externe': 1,
        'Instruites en interne': 0
      },
      financialHelpRequestTotalAmount: 0
    })
  })
})
