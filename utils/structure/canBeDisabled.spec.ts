import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { canBeDisabled } from './canBeDisabled'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2025-06-15'))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('canBeDisabled', () => {
  test('should return true when lastAccess is older than 6 months + 2 weeks', () => {
    expect(
      canBeDisabled({
        lastAccess: new Date('2024-11-01'),
        created: new Date('2024-01-01')
      })
    ).toBe(true)
  })

  test('should return false when lastAccess is within 6 months + 2 weeks', () => {
    expect(
      canBeDisabled({
        lastAccess: new Date('2025-01-01'),
        created: new Date('2024-01-01')
      })
    ).toBe(false)
  })

  test('should fall back to created date when lastAccess is null', () => {
    expect(
      canBeDisabled({
        lastAccess: null,
        created: new Date('2024-11-01')
      })
    ).toBe(true)
  })

  test('should return false when created is recent and lastAccess is null', () => {
    expect(
      canBeDisabled({
        lastAccess: null,
        created: new Date('2025-03-01')
      })
    ).toBe(false)
  })

  test('should return true at the boundary (exactly 6 months + 2 weeks ago)', () => {
    expect(
      canBeDisabled({
        lastAccess: new Date('2024-11-30'),
        created: new Date('2024-01-01')
      })
    ).toBe(true)
  })
})
