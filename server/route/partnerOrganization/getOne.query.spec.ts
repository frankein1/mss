import { describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  FixturePartnerOrganization,
  fixturesPartnerOrganizations
} from '~/prisma/fixtures'

const partnerId =
  fixturesPartnerOrganizations[FixturePartnerOrganization.CAF26].id

describe('PartnerOrganization - GetOne - Authorizations', () => {
  test('A manager can get a partner organization from their structure', async ({
    trpc
  }) => {
    const result = await trpc.structureManager.partner.getOne({ id: partnerId })

    expect(result.id).toBe(partnerId)
  })

  test('A user from another structure cannot get a partner organization', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManagerMinistere.partner.getOne({ id: partnerId })
    ).rejects.toThrow(/partnerOrganization[\s\S]*?no record/im)
  })

  test('An administrator cannot get a partner organization', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.administrator.partner.getOne({ id: partnerId })
    ).rejects.toThrow(/user routes are not available to admins/i)
  })
})
