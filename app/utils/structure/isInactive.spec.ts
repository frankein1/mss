import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { isInactive } from './isInactive'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2025-06-15'))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('isInactive', () => {
  test('should return true when lastAccess is older than 6 months', () => {
    expect(
      isInactive({
        lastAccess: new Date('2024-11-01'),
        created: new Date('2024-01-01')
      })
    ).toBe(true)
  })

  test('should return false when lastAccess is within 6 months', () => {
    expect(
      isInactive({
        lastAccess: new Date('2025-03-01'),
        created: new Date('2024-01-01')
      })
    ).toBe(false)
  })

  test('should ignore created when lastAccess is recent', () => {
    expect(
      isInactive({
        lastAccess: new Date('2025-06-01'),
        created: new Date('2020-01-01')
      })
    ).toBe(false)
  })

  test('should fall back to created date when lastAccess is null', () => {
    expect(
      isInactive({
        lastAccess: null,
        created: new Date('2024-11-01')
      })
    ).toBe(true)
  })

  test('should return false when created is recent and lastAccess is null', () => {
    expect(
      isInactive({
        lastAccess: null,
        created: new Date('2025-03-01')
      })
    ).toBe(false)
  })

  test('should return false at the boundary (exactly 6 months ago)', () => {
    expect(
      isInactive({
        lastAccess: new Date('2024-12-15'),
        created: new Date('2024-01-01')
      })
    ).toBe(false)
  })
})
