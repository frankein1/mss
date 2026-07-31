import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { isWorkshopPassed } from './isWorkshopPassed'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2025-06-15T14:00:00'))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('isWorkshopPassed', () => {
  test('should return true when workshop date is in the past', () => {
    expect(isWorkshopPassed(new Date('2025-06-14'), null, null)).toBe(true)
  })

  test('should return false when workshop date is in the future', () => {
    expect(isWorkshopPassed(new Date('2025-06-16'), null, null)).toBe(false)
  })

  test('should use endTime to determine if passed', () => {
    expect(isWorkshopPassed(new Date('2025-06-15'), '10:00', '13:00')).toBe(
      true
    )
  })

  test('should return false when endTime has not been reached', () => {
    expect(isWorkshopPassed(new Date('2025-06-15'), '10:00', '15:00')).toBe(
      false
    )
  })

  test('should use startTime when endTime is null', () => {
    expect(isWorkshopPassed(new Date('2025-06-15'), '13:00', null)).toBe(true)
  })

  test('should return false when startTime has not been reached and endTime is null', () => {
    expect(isWorkshopPassed(new Date('2025-06-15'), '15:00', null)).toBe(false)
  })

  test('should prefer endTime over startTime when both are set', () => {
    expect(isWorkshopPassed(new Date('2025-06-15'), '10:00', '13:30')).toBe(
      true
    )
  })
})
