import { describe, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'

describe('Followup - GetOngoing - Authorizations', () => {
  test('A referent can get ongoing followup counts', async ({ trpc }) => {
    const result = await trpc.referent.followup.getOngoing()

    expect(result).toEqual([{ status: 'InProgress', _count: 1 }])
  })

  test('A manager gets an empty result when they have no ongoing followups', async ({
    trpc
  }) => {
    const result = await trpc.structureManager.followup.getOngoing()

    expect(result).toStrictEqual([])
  })

  test('A user from another structure gets an empty result', async ({
    trpc
  }) => {
    const result = await trpc.structureManagerMinistere.followup.getOngoing()

    expect(result).toStrictEqual([])
  })

  test('An administrator cannot get ongoing followups', async ({ trpc }) => {
    await expect(() =>
      trpc.administrator.followup.getOngoing()
    ).rejects.toThrow(/user routes are not available to admins/i)
  })
})
