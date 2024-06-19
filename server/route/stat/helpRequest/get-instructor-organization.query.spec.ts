import { describe, expect } from 'vitest'
import { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'

import { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<
  AppRouter['stat']['getInstructorOrganizationStats']
>

type Output = inferProcedureOutput<
  AppRouter['stat']['getInstructorOrganizationStats']
>

const parseStats = (stats: Output) =>
  stats.reduce<Record<string, number>>(
    (acc, { instructorOrganization, _count }) => ({
      ...acc,
      [instructorOrganization]: _count
    }),
    {}
  )

describe('Statistics - File Instructions - Instructor Organization', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats =
      await trpc.structureManager.stat.getInstructorOrganizationStats(input)

    expect(parseStats(stats)).toEqual({ 'CAF 26': 2, 'Non renseigné': 1 })
  })

  test('should not allow stats computation as a reception agent', async ({
    trpc
  }) => {
    const input: Input = {}

    await expect(() =>
      trpc.receptionAgent.stat.getInstructorOrganizationStats(input)
    ).rejects.toThrowError(/not allowed to access route/)
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.referent.stat.getInstructorOrganizationStats(input)

    expect(parseStats(stats)).toEqual({ 'Non renseigné': 1 })
  })
})
