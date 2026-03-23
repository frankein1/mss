import { describe, expect } from 'vitest'
import type { inferProcedureInput } from '@trpc/server'
import { test } from '~/test/server/test-utils'

import type { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<
  AppRouter['stat']['getFollowupRedirectionsStats']
>

describe('Statistics - Followups - Redirections', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats =
      await trpc.structureManager.stat.getFollowupRedirectionsStats(input)

    expect(stats.followups._count).toBe(6)
    expect(stats.followupsWithRedirections._count).toBe(4)
    expect(stats.withTypeIsPartners._count).toBe(3)
    expect(stats.withTypeIsPartners.partners).toHaveLength(3)
    expect(stats.withTypeIsIntern._count).toBe(2)
    expect(stats.withTypeIsOther._count).toBe(1)
  })

  test('should not allow stats computation as a reception agent', async ({
    trpc
  }) => {
    const input: Input = {}

    await expect(() =>
      trpc.receptionAgent.stat.getFollowupRedirectionsStats(input)
    ).rejects.toThrowError(/not allowed to access route/)
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.referent.stat.getFollowupRedirectionsStats(input)

    expect(stats.followups._count).toBe(2)
    expect(stats.followupsWithRedirections._count).toBe(1)
    expect(stats.withTypeIsPartners._count).toBe(1)
    expect(stats.withTypeIsPartners.partners).toHaveLength(1)
    expect(stats.withTypeIsIntern._count).toBe(0)
    expect(stats.withTypeIsOther._count).toBe(0)
  })
})
