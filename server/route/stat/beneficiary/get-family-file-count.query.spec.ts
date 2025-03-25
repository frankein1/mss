import { describe, expect } from 'vitest'
import { inferProcedureInput } from '@trpc/server'
import { test } from '~/test/server/test-utils'

import { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<AppRouter['stat']['getFamilyFileCount']>

describe('Statistics - Beneficiary - Family File Count', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.structureManager.stat.getFamilyFileCount(input)

    expect(stats).toEqual({ family: 1, beneficiary: 11 })
  })
})
