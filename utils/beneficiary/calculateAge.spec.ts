import { afterEach, beforeEach, describe, test, expect, vi } from 'vitest'
import { calculateAge } from './calculateAge'

describe('calculateAge', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-06-15'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('should return age in years', () => {
    expect(calculateAge(new Date('1990-01-01'))).toBe(34)
  })
})
