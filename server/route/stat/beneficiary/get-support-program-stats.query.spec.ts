import { describe, expect } from 'vitest'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'
import type { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<AppRouter['stat']['getSupportProgramStats']>

type Output = inferProcedureOutput<AppRouter['stat']['getSupportProgramStats']>

const parseStats = (stats: Output) =>
  stats.reduce<Record<string, number>>(
    (acc, { name, count }) => ({
      ...acc,
      [name]: count
    }),
    {}
  )

describe('Statistics - Beneficiary - Support Program Stats', () => {
  describe('Authorizations', () => {
    test('Reception agent cannot access the route', async ({ trpc }) => {
      await expect(() =>
        trpc.receptionAgent.stat.getSupportProgramStats({})
      ).rejects.toThrow(/not allowed to access route/)
    })
  })

  describe('Counts', () => {
    test('Structure manager gets distinct beneficiary count per program', async ({
      trpc
    }) => {
      const input: Input = {}
      const stats =
        await trpc.structureManager.stat.getSupportProgramStats(input)

      expect(parseStats(stats)).toEqual({
        'Portage de repas': 3,
        'Aide à domicile': 2
      })
    })

    test('Referent only sees programs linked to assigned beneficiaries', async ({
      trpc
    }) => {
      const input: Input = {}
      const stats = await trpc.referent.stat.getSupportProgramStats(input)

      expect(parseStats(stats)).toEqual({
        'Aide à domicile': 2,
        'Portage de repas': 1
      })
    })
  })
})
