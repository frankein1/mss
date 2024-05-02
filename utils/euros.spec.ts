import { describe, test, expect } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'
import { euros } from './euros'

describe('euros transformation', () => {
  test('with non integer value should have 2 digits after floating point', () => {
    expect(euros(1.234567)).toBe('1,23')
  })

  test('with non integer value should have 2 digits after floating point and end with 0', () => {
    expect(euros(1.2)).toBe('1,20')
  })

  test('with integer value should have no floating point', () => {
    expect(euros(12)).toBe('12')
  })

  test('should round non integer value to 2 digits after floating point', () => {
    expect(euros(1.235)).toBe('1,24')
  })

  test('with string value should behave like number', () => {
    expect(euros('1.234567')).toBe('1,23')
  })

  test('with decimal value should behave like number', () => {
    expect(euros(new Decimal(1.234567))).toBe('1,23')
  })

  test('with null value should return empty string', () => {
    expect(euros(null)).toBe('')
  })

  test('with undefined value should return empty string', () => {
    expect(euros(undefined)).toBe('')
  })

  test('with NaN value should return empty string', () => {
    expect(euros(NaN)).toBe('')
  })

  test('with random string should return empty string', () => {
    expect(euros('abcdef')).toBe('')
  })

  test('with NaN string should return empty string', () => {
    expect(euros('NaN')).toBe('')
  })
})
