import { describe, expect } from 'vitest'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'

import type { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<
  AppRouter['stat']['getFollowupRedirectionReasonsStats']
>

type Output = inferProcedureOutput<
  AppRouter['stat']['getFollowupRedirectionReasonsStats']
>

const parseReasons = (reasons: Output['reasons']) =>
  reasons.reduce<Record<string, number>>(
    (acc, { name, _count }) => ({ ...acc, [name]: _count }),
    {}
  )

describe('Statistics - Followups - Redirection reasons', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats =
      await trpc.structureManager.stat.getFollowupRedirectionReasonsStats(input)

    // 5 followups carry 6 redirections with a reason: the headline counts
    // followups, the breakdown counts redirections, so they do not match
    expect(stats.followupsWithReason._count).toBe(5)
    expect(parseReasons(stats.reasons)).toEqual({
      'Accès aux droits': 2,
      "Aide alimentaire d'urgence": 2,
      'Insertion professionnelle': 1,
      'Prévention expulsion locative': 1
    })
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats =
      await trpc.referent.stat.getFollowupRedirectionReasonsStats(input)

    expect(stats.followupsWithReason._count).toBe(1)
    expect(parseReasons(stats.reasons)).toEqual({
      'Accès aux droits': 1
    })
  })
})
