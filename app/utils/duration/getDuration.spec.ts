import { describe, test, expect } from 'vitest'
import { getDurationInHoursAndMinutes } from './getDuration'

describe('getDurationInHoursAndMinutes', () => {
  test('should return empty string for zero duration', () => {
    const date = new Date('2025-06-15T10:00:00')
    expect(getDurationInHoursAndMinutes(date, date)).toBe('')
  })

  test('should return empty string for negative duration', () => {
    const start = new Date('2025-06-15T11:00:00')
    const end = new Date('2025-06-15T10:00:00')
    expect(getDurationInHoursAndMinutes(start, end)).toBe('')
  })

  test('should format duration less than 1 hour in minutes', () => {
    const start = new Date('2025-06-15T10:00:00')
    const end = new Date('2025-06-15T10:30:00')
    expect(getDurationInHoursAndMinutes(start, end)).toBe('30 minutes')
  })

  test('should format exactly 1 hour', () => {
    const start = new Date('2025-06-15T10:00:00')
    const end = new Date('2025-06-15T11:00:00')
    expect(getDurationInHoursAndMinutes(start, end)).toBe('1 heure')
  })

  test('should format 1 hour and minutes', () => {
    const start = new Date('2025-06-15T10:00:00')
    const end = new Date('2025-06-15T11:30:00')
    expect(getDurationInHoursAndMinutes(start, end)).toBe('1 heure 30 minutes')
  })

  test('should format more than 2 hours with minutes', () => {
    const start = new Date('2025-06-15T10:00:00')
    const end = new Date('2025-06-15T12:15:00')
    expect(getDurationInHoursAndMinutes(start, end)).toBe('2 heures 15 minutes')
  })

  test('should format exact multiple hours', () => {
    const start = new Date('2025-06-15T10:00:00')
    const end = new Date('2025-06-15T13:00:00')
    expect(getDurationInHoursAndMinutes(start, end)).toBe('3 heures')
  })
})
