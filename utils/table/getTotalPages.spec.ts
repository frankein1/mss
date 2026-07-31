import { describe, test, expect } from 'vitest'
import { getTotalPages } from './getTotalPages'

describe('getTotalPages', () => {
  test('should return 1 for exact single page', () => {
    expect(getTotalPages({ perPage: 10, count: 10 })).toBe(1)
  })

  test('should ceil to next page when there is a remainder', () => {
    expect(getTotalPages({ perPage: 10, count: 11 })).toBe(2)
  })

  test('should return 1 when count is 0', () => {
    expect(getTotalPages({ perPage: 10, count: 0 })).toBe(1)
  })

  test('should return 1 for count less than perPage', () => {
    expect(getTotalPages({ perPage: 10, count: 3 })).toBe(1)
  })

  test('should handle large counts', () => {
    expect(getTotalPages({ perPage: 25, count: 101 })).toBe(5)
  })
})
