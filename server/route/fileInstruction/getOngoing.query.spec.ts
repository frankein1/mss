import { describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'

describe('FileInstruction - GetOngoing - Authorizations', () => {
  test('A social worker can get ongoing file instruction counts', async ({
    trpc
  }) => {
    const result = await trpc.socialWorker.fileInstruction.getOngoing()

    expect(result.length).toBeGreaterThan(0)
    const investigationOngoing = result.find(
      r => r.status === 'InvestigationOngoing'
    )
    expect(investigationOngoing).toBeDefined()
    expect(investigationOngoing!._count).toBeGreaterThan(0)
  })

  test('A manager gets an empty result when they have no ongoing file instructions', async ({
    trpc
  }) => {
    const result = await trpc.structureManager.fileInstruction.getOngoing()

    expect(result).toStrictEqual([])
  })

  test('A user from another structure gets an empty result', async ({
    trpc
  }) => {
    const result =
      await trpc.structureManagerMinistere.fileInstruction.getOngoing()

    expect(result).toStrictEqual([])
  })

  test('An administrator cannot get ongoing file instructions', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.administrator.fileInstruction.getOngoing()
    ).rejects.toThrow(/user routes are not available to admins/i)
  })
})
