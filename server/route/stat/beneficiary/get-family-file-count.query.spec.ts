import { describe, expect } from 'vitest'
import type { inferProcedureInput } from '@trpc/server'
import { test } from '~/test/server/test-utils'
import { AgeGroup } from '~/client/options'
import type { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<AppRouter['stat']['getFamilyFileCount']>

describe('Statistics - Beneficiary - Family File Count', () => {
  test('should compute stats as a structure manager with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.structureManager.stat.getFamilyFileCount(input)

    expect(stats).toEqual({ family: 3, beneficiary: 20 })
  })

  test('should compute stats including only beneficiaries followed as a referent', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats = await trpc.referent.stat.getFamilyFileCount(input)

    expect(stats).toEqual({ family: 1, beneficiary: 10 })
  })

  test('should compute stats with beneficiaryStatus filter', async ({
    trpc
  }) => {
    const input: Input = { beneficiaryStatus: 'Active' }

    const stats = await trpc.structureManager.stat.getFamilyFileCount(input)

    expect(stats).toEqual({ family: 3, beneficiary: 16 })
  })

  test('should compute stats with ageGroup filter', async ({ trpc }) => {
    const input: Input = { ageGroup: AgeGroup.Group35_44 }

    const stats = await trpc.structureManager.stat.getFamilyFileCount(input)

    expect(stats).toEqual({ family: 0, beneficiary: 2 })
  })

  test('should compute stats with cities filter', async ({ trpc }) => {
    const input: Input = { cities: ['Dijon'] }

    const stats = await trpc.structureManager.stat.getFamilyFileCount(input)

    expect(stats).toEqual({ family: 0, beneficiary: 3 })
  })
})
