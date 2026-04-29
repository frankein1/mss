import { describe, test, expect } from 'vitest'
import {
  dateOrEmpty,
  kindOfBooleanSchema,
  phoneConstraint
} from './helpers.schema'
import { validDate } from '~/utils/zod'

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

describe('date or empty schema', () => {
  test('validates empty date', () => {
    const d = dateOrEmpty.safeParse('')
    expect(d.success).toBe(true)
    expect(d.data).toBe(null)
  })

  test('validates undefined date', () => {
    const d = dateOrEmpty.safeParse(undefined)
    expect(d.success).toBe(true)
    expect(d.data).toBe(undefined)
  })

  test('validates null date', () => {
    const d = dateOrEmpty.safeParse(null)
    expect(d.success).toBe(true)
    expect(d.data).toBe(null)
  })

  test('does not validate when not a date format', () => {
    const d = dateOrEmpty.safeParse('abcd')
    expect(d.success).toBe(false)
    expect(d.error?.errors[0]?.message).toBe(validDate)
  })

  test('validates with format with `YYYY-MM-DD`', () => {
    const d = dateOrEmpty.safeParse('2020-01-20')
    expect(d.success).toBe(true)
    expect(d.data).toStrictEqual(new Date('2020-01-20'))
  })

  test('does not validate when year is not valid (allows to avoid postgres errors in date)', () => {
    const d = dateOrEmpty.safeParse('10000-01-01')
    expect(d.success).toBe(false)
    expect(d.error?.errors[0]?.message).toBe(validYear)
  })

  test('validates with format with `YYYY/MM/DD`', () => {
    const d = dateOrEmpty.safeParse('2020/01/20')
    expect(d.success).toBe(true)
    expect(d.data).toStrictEqual(new Date('2020-01-20'))
  })

  test('does not validate with format with `DD/MM/YYYY`', () => {
    const d = dateOrEmpty.safeParse('20-01-2020')
    expect(d.success).toBe(false)
    expect(d.error?.errors[0]?.message).toBe(validDate)
  })

  test('validates with format `MMM DD YYYY`', () => {
    const d = dateOrEmpty.safeParse('Jan 20 2020')
    expect(d.success).toBe(true)
    expect(d.data).toStrictEqual(new Date('2020-01-20'))
  })
})

describe('kindOfBooleanSchema (optional)', () => {
  const schema = kindOfBooleanSchema()

  test.each([
    { input: 'true', expected: true },
    { input: 'false', expected: false },
    { input: true, expected: true },
    { input: false, expected: false },
    { input: '', expected: null },
    { input: null, expected: null },
    { input: undefined, expected: null }
  ])('parses $input to $expected', ({ input, expected }) => {
    expect(schema.parse(input)).toBe(expected)
  })

  test('rejects invalid string', () => {
    expect(() => schema.parse('maybe')).toThrow()
  })
})

describe('kindOfBooleanSchema (required)', () => {
  const schema = kindOfBooleanSchema(true)

  test.each([
    { input: 'true', expected: true },
    { input: 'false', expected: false },
    { input: true, expected: true },
    { input: false, expected: false }
  ])('parses $input to $expected', ({ input, expected }) => {
    expect(schema.parse(input)).toBe(expected)
  })

  test.each([null, undefined, ''])('rejects %s', input => {
    expect(() => schema.parse(input)).toThrow()
  })
})
