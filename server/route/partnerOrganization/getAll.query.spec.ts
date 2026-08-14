import { describe, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import {
  FixturePartnerOrganization,
  fixturesPartnerOrganizations
} from '~~/prisma/fixtures'

describe('PartnerOrganization - GetAll - Authorizations', () => {
  test('A manager can list active partner organizations', async ({ trpc }) => {
    const result = await trpc.structureManager.partner.getAll()

    expect(result).toHaveLength(18)
    const ids = result.map((p: { id: string }) => p.id)
    expect(ids).toContain(
      fixturesPartnerOrganizations[FixturePartnerOrganization.CAF26].id
    )
  })

  test('Inactive partners are excluded from results', async ({ trpc }) => {
    const result = await trpc.structureManager.partner.getAll()
    const inactiveId =
      fixturesPartnerOrganizations[FixturePartnerOrganization.MasinSolidarited]
        .id

    const found = result.find((p: { id: string }) => p.id === inactiveId)
    expect(found).toBeUndefined()
  })

  test('A user from another structure gets no results', async ({ trpc }) => {
    const result = await trpc.structureManagerMinistere.partner.getAll()

    expect(result).toStrictEqual([])
  })

  test('An administrator cannot list partner organizations', async ({
    trpc
  }) => {
    await expect(() => trpc.administrator.partner.getAll()).rejects.toThrow(
      /user routes are not available to admins/i
    )
  })
})
