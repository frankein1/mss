import { describe, expect } from 'vitest'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'
import type { AppRouter } from '~/server/trpc/routers'
import { StatPeriodFilter } from '~/types/stat'

type Input = inferProcedureInput<AppRouter['stat']['getSupportProgramStats']>

type Output = inferProcedureOutput<AppRouter['stat']['getSupportProgramStats']>

const parseByName = (stats: Output) =>
  stats.reduce<
    Record<string, { count: number; entryCount: number; exitCount: number }>
  >(
    (acc, { name, count, entryCount, exitCount }) => ({
      ...acc,
      [name]: { count, entryCount, exitCount }
    }),
    {}
  )

// Custom period covering the year 2025, in which the fixture start/end dates fall.
const year2025: Input = {
  period: StatPeriodFilter.Custom,
  fromDate: new Date('2025-01-01'),
  toDate: new Date('2025-12-31')
}

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

      expect(parseByName(stats)).toEqual({
        'Portage de repas': { count: 3, entryCount: 0, exitCount: 0 },
        'Aide à domicile': { count: 2, entryCount: 0, exitCount: 0 }
      })
    })

    test('Referent only sees programs linked to assigned beneficiaries', async ({
      trpc
    }) => {
      const input: Input = {}
      const stats = await trpc.referent.stat.getSupportProgramStats(input)

      expect(parseByName(stats)).toEqual({
        'Aide à domicile': { count: 2, entryCount: 0, exitCount: 0 },
        'Portage de repas': { count: 1, entryCount: 0, exitCount: 0 }
      })
    })
  })

  describe('Entry and exit counts', () => {
    test('Structure manager gets period-scoped entry and exit counts, excluding null dates and deduplicating beneficiaries', async ({
      trpc
    }) => {
      const stats =
        await trpc.structureManager.stat.getSupportProgramStats(year2025)

      expect(parseByName(stats)).toEqual({
        'Portage de repas': { count: 3, entryCount: 2, exitCount: 2 },
        'Aide à domicile': { count: 2, entryCount: 1, exitCount: 1 }
      })
    })

    test('The same beneficiary with two in-period enrollments counts as one entry', async ({
      trpc
    }) => {
      const stats =
        await trpc.structureManager.stat.getSupportProgramStats(year2025)

      const portage = stats.find(({ name }) => name === 'Portage de repas')

      // WONFAR has two Portage enrollments that both start in period (2025-02 and
      // 2025-05). Entry dedups WONFAR to one, so entryCount stays 2 (WONFAR +
      // COURSOR) rather than 3 — this is what guards the entry Set dedup. Without
      // dedup WONFAR's two start dates would inflate entryCount to 3.
      expect(portage).toMatchObject({ entryCount: 2 })
    })

    test('Referent entry and exit counts respect beneficiary constraints', async ({
      trpc
    }) => {
      const stats = await trpc.referent.stat.getSupportProgramStats(year2025)

      expect(parseByName(stats)).toEqual({
        // Referent only sees COURSOR in Portage: entry in 2025, no exit.
        'Portage de repas': { count: 1, entryCount: 1, exitCount: 0 },
        // Referent sees COURSOR (entry) and HEINIG (exit) in Aide à domicile.
        'Aide à domicile': { count: 2, entryCount: 1, exitCount: 1 }
      })
    })
  })
})
