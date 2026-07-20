import { describe, expect } from 'vitest'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { FileInstructionType } from '@prisma/client'
import { test } from '~/test/server/test-utils'

import type { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<
  AppRouter['stat']['getHelpRequestRedirectionReasonsStats']
>

type Output = inferProcedureOutput<
  AppRouter['stat']['getHelpRequestRedirectionReasonsStats']
>

const parseReasons = (reasons: Output['reasons']) =>
  reasons.reduce<Record<string, number>>(
    (acc, { name, _count }) => ({ ...acc, [name]: _count }),
    {}
  )

describe('Statistics - Help Requests - Redirection reasons', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats =
      await trpc.structureManager.stat.getHelpRequestRedirectionReasonsStats(
        input
      )

    // 4 help requests carry 5 redirections with a reason: the headline counts
    // help requests, the breakdown counts redirections, so they do not match
    expect(stats.helpRequestsWithReason._count).toBe(4)
    expect(parseReasons(stats.reasons)).toEqual({
      'Soutien à la parentalité': 2,
      'Accès aux droits': 1,
      'Insertion professionnelle': 1,
      'Prévention expulsion locative': 1
    })
  })

  test('should not allow stats computation as a reception agent', async ({
    trpc
  }) => {
    const input: Input = {}

    await expect(() =>
      trpc.receptionAgent.stat.getHelpRequestRedirectionReasonsStats(input)
    ).rejects.toThrowError(/not allowed to access route/)
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats =
      await trpc.referent.stat.getHelpRequestRedirectionReasonsStats(input)

    expect(stats.helpRequestsWithReason._count).toBe(1)
    expect(parseReasons(stats.reasons)).toEqual({
      'Prévention expulsion locative': 1,
      'Soutien à la parentalité': 1
    })
  })

  test('should only include housing help requests when filtering on that subject', async ({
    trpc
  }) => {
    const input: Input = { helpRequestSubject: FileInstructionType.Housing }

    const stats =
      await trpc.structureManager.stat.getHelpRequestRedirectionReasonsStats(
        input
      )

    expect(stats.helpRequestsWithReason._count).toBe(1)
    expect(parseReasons(stats.reasons)).toEqual({
      'Soutien à la parentalité': 1
    })
  })
})
