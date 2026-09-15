import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { test } from './__fixtures__'
import {
  getInactiveBeneficiaries,
  getInactiveBeneficiariesWithOneMonthNotification
} from './helper'
import createArchiveDueOneMonthNotifications from './create-archive-due-one-month-notifications'

beforeAll(async () => await test.createBeneficiary())

afterAll(async () => await test.deleteBeneficiary())

describe('Notification - Beneficiary Archive - List inactive beneficiaries', () => {
  it('should return 4 beneficiaries', async () => {
    const beneficiaries = await getInactiveBeneficiaries()

    const set = new Set(beneficiaries.map(b => b.id))
    expect(set.has(test.ID_JOHN_DOE)).toBe(true)
    expect(set.has(test.ID_ERIC_DUVERS)).toBe(true)
    expect(set.has(test.ID_INACTIVE)).toBe(true)
    expect(set.has(test.ID_TESSON)).toBe(true)

    expect(set.size).toBe(4)
  })

  it('should return 4 beneficiaries', async () => {
    await createArchiveDueOneMonthNotifications()
    const beneficiaries =
      await getInactiveBeneficiariesWithOneMonthNotification()
    const set = new Set(beneficiaries.map(b => b?.id))
    expect(set.has(test.ID_JOHN_DOE)).toBe(true)
    expect(set.has(test.ID_ERIC_DUVERS)).toBe(true)
    expect(set.has(test.ID_INACTIVE)).toBe(true)
    expect(set.has(test.ID_TESSON)).toBe(true)
    expect(set.size).toBe(4)
  })
})
