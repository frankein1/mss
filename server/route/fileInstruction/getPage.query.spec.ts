import { describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'

const input = {
  page: 1,
  perPage: 10,
  orderBy: {},
  filters: {}
}

describe('FileInstruction - GetPage - Authorizations', () => {
  test('A manager can list file instructions', async ({ trpc }) => {
    const result = await trpc.structureManager.fileInstruction.getPage(input)

    expect(result.count).toBeGreaterThan(0)
    expect(result.items.length).toBeGreaterThan(0)
  })

  test('A referent sees only file instructions from their assigned family files', async ({
    trpc
  }) => {
    const managerResult =
      await trpc.structureManager.fileInstruction.getPage(input)
    const referentResult = await trpc.referent.fileInstruction.getPage(input)

    expect(referentResult.count).toBeLessThan(managerResult.count)
  })

  test('Page 2 returns remaining items', async ({ trpc }) => {
    const page1 = await trpc.structureManager.fileInstruction.getPage(input)
    const page2 = await trpc.structureManager.fileInstruction.getPage({
      ...input,
      page: 2
    })

    expect(page1.items.length + page2.items.length).toBe(page1.count)
  })

  test('A user from another structure gets no results', async ({ trpc }) => {
    const result =
      await trpc.structureManagerMinistere.fileInstruction.getPage(input)

    expect(result.items).toStrictEqual([])
    expect(result.count).toBe(0)
  })

  test('An administrator cannot list file instructions', async ({ trpc }) => {
    await expect(() =>
      trpc.administrator.fileInstruction.getPage(input)
    ).rejects.toThrow(/user routes are not available to admins/i)
  })
})
