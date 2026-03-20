import { describe, expect } from 'vitest'
import type { inferProcedureInput } from '@trpc/server'
import { test } from '~/test/server/test-utils'

import type { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<AppRouter['stat']['getFamilyFileCount']>

describe('Statistics - Beneficiary - Family File Count', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.structureManager.stat.getFamilyFileCount(input)

    expect(stats).toEqual({ family: 1, beneficiary: 11 })
  })

  test('should not allow stats computation as a reception agent', async ({
    trpc
  }) => {
    const input: Input = {}

    await expect(() =>
      trpc.receptionAgent.stat.getFamilyFileCount(input)
    ).rejects.toThrowError(/not allowed to access route/)
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.referent.stat.getFamilyFileCount(input)

    expect(stats).toEqual({ family: 1, beneficiary: 5 })
  })

  test('should compute stats with beneficiaryStatus filter', async ({
    trpc
  }) => {
    const input: Input = { beneficiaryStatus: 'Active' }

    const stats = await trpc.structureManager.stat.getFamilyFileCount(input)

    expect(stats).toEqual({ family: 1, beneficiary: 7 })
  })
})
