import { describe, test, expect } from 'vitest'
import { phoneConstraint } from './helpers.schema'

describe('phone number schema', () => {
  test('fails phone number with 3 digits', () => {
    expect(phoneConstraint.safeParse('39 4').success).toBe(false)
  })

  test('validates phone number with 4 digits', () => {
    expect(phoneConstraint.safeParse('39 49').success).toBe(true)
  })

  test('fails phone number with 5 digits', () => {
    expect(phoneConstraint.safeParse('39 49 5').success).toBe(false)
  })

  test('validates phone number with 6 digits', () => {
    expect(phoneConstraint.safeParse('58 39 49').success).toBe(true)
  })

  test('fails phone number with 7 digits', () => {
    expect(phoneConstraint.safeParse('58 39 49 4').success).toBe(false)
  })

  test('validates phone number with 8 digits', () => {
    expect(phoneConstraint.safeParse('58 39 49 45').success).toBe(true)
  })

  test('fails phone number with 7 digits', () => {
    expect(phoneConstraint.safeParse('58 39 49 45 5').success).toBe(false)
  })

  test('validates phone number with 10 digits', () => {
    expect(phoneConstraint.safeParse('05 90 22 33 44').success).toBe(true)
  })

  test('validates hexagonal france phone number with international code', () => {
    expect(phoneConstraint.safeParse('+33 1 01 01 01 01').success).toBe(true)
  })

  test('validates martinique phone number with international code', () => {
    expect(phoneConstraint.safeParse('+596 5 96 01 01 01').success).toBe(true)
  })

  test('validates guadalupe phone number with international code', () => {
    expect(phoneConstraint.safeParse('+590 5 90 01 01 01').success).toBe(true)
  })

  test('validates french guyana phone number with international code', () => {
    expect(phoneConstraint.safeParse('+594 5 94 01 01 01').success).toBe(true)
  })

  test('validates reunion island phone number with international code', () => {
    expect(phoneConstraint.safeParse('+592 1 01 01 01 01').success).toBe(true)
  })

  test('validates new caledonia phone number with international code', () => {
    expect(phoneConstraint.safeParse('+687 22 33 44').success).toBe(true)
  })

  test('validates st-pierre-et-miquelon phone number with international code', () => {
    expect(phoneConstraint.safeParse('+508 22 33 44').success).toBe(true)
  })

  test('validates french polynesia phone number with international code', () => {
    expect(phoneConstraint.safeParse('+689 22 33 44 55').success).toBe(true)
  })

  test('validates international phone number from cameroon', () => {
    expect(phoneConstraint.safeParse('+237 22 33 44 55').success).toBe(true)
  })

  test('validates international phone number from japan', () => {
    expect(phoneConstraint.safeParse('+813 12 34 56 78').success).toBe(true)
  })
})
