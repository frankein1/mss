import { describe, test, expect } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'
import { incrementBudgetTotal } from './incrementBudgetTotal'

describe('incrementBudgetTotal', () => {
  test('should add a number to a null accumulator', () => {
    expect(incrementBudgetTotal(null, 10)).toBe(10)
  })

  test('should add a number to an existing accumulator', () => {
    expect(incrementBudgetTotal(5, 10)).toBe(15)
  })

  test('should handle string values', () => {
    expect(incrementBudgetTotal(null, '7.5')).toBe(7.5)
  })

  test('should handle Decimal values', () => {
    expect(incrementBudgetTotal(null, new Decimal(12.34))).toBeCloseTo(12.34)
  })

  test('should accumulate Decimal on existing total', () => {
    expect(incrementBudgetTotal(10, new Decimal(5.5))).toBeCloseTo(15.5)
  })

  test('should return accumulator unchanged for null value', () => {
    expect(incrementBudgetTotal(5, null)).toBe(5)
  })

  test('should return accumulator unchanged for undefined value', () => {
    expect(incrementBudgetTotal(5, undefined)).toBe(5)
  })

  test('should return accumulator unchanged for NaN value', () => {
    expect(incrementBudgetTotal(5, NaN)).toBe(5)
  })

  test('should return null accumulator unchanged for null value', () => {
    expect(incrementBudgetTotal(null, null)).toBeNull()
  })

  test('should handle NaN string by returning accumulator', () => {
    expect(incrementBudgetTotal(3, 'abc')).toBe(3)
  })

  test('should handle zero value', () => {
    expect(incrementBudgetTotal(null, 0)).toBe(0)
  })

  test('should accumulate zero on existing total', () => {
    expect(incrementBudgetTotal(5, 0)).toBe(5)
  })
})
