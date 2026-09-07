import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { canBeDisabled } from './canBeDisabled'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2025-06-15'))
})

afterEach(() => {
  vi.useRealTimers()
})

/** Inactive since 2024-11-01 and both alert emails sent long enough ago. */
const disableableStructure = {
  lastAccess: new Date('2024-11-01'),
  created: new Date('2024-01-01'),
  deactivationAlertEmail: 2,
  deactivationAlertEmailDate: new Date('2025-05-01')
}

describe('canBeDisabled', () => {
  test('should return true when inactive and both alert emails were sent more than 4 weeks ago', () => {
    expect(canBeDisabled(disableableStructure)).toBe(true)
  })

  test('should fall back to created date when lastAccess is null', () => {
    expect(
      canBeDisabled({
        ...disableableStructure,
        lastAccess: null,
        created: new Date('2024-11-01')
      })
    ).toBe(true)
  })

  describe('inactivity', () => {
    test('should return false when lastAccess is within 6 months', () => {
      expect(
        canBeDisabled({
          ...disableableStructure,
          lastAccess: new Date('2025-03-01')
        })
      ).toBe(false)
    })

    test('should return false when created is recent and lastAccess is null', () => {
      expect(
        canBeDisabled({
          ...disableableStructure,
          lastAccess: null,
          created: new Date('2025-03-01')
        })
      ).toBe(false)
    })

    test('should return false at the boundary (exactly 6 months ago)', () => {
      expect(
        canBeDisabled({
          ...disableableStructure,
          lastAccess: new Date('2024-12-15')
        })
      ).toBe(false)
    })
  })

  describe('alert emails', () => {
    test('should return false when no alert email was sent', () => {
      expect(
        canBeDisabled({
          ...disableableStructure,
          deactivationAlertEmail: 0,
          deactivationAlertEmailDate: null
        })
      ).toBe(false)
    })

    test('should return false when only the first alert email was sent', () => {
      expect(
        canBeDisabled({
          ...disableableStructure,
          deactivationAlertEmail: 1
        })
      ).toBe(false)
    })

    test('should return false when the count says 2 but no date was recorded', () => {
      expect(
        canBeDisabled({
          ...disableableStructure,
          deactivationAlertEmailDate: null
        })
      ).toBe(false)
    })

    test('should return false when the alert email date is less than 4 weeks old', () => {
      expect(
        canBeDisabled({
          ...disableableStructure,
          deactivationAlertEmailDate: new Date('2025-06-01')
        })
      ).toBe(false)
    })

    test('should return false at the boundary (exactly 4 weeks ago)', () => {
      expect(
        canBeDisabled({
          ...disableableStructure,
          deactivationAlertEmailDate: new Date('2025-05-18')
        })
      ).toBe(false)
    })
  })
})
