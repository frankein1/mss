import { describe, test, expect } from 'vitest'
import { formatPhone } from './formatPhone'

describe('phone number field formatting', () => {
  test('phone number with 4 digits', () => {
    expect(formatPhone('3949')).toBe('39 49')
  })

  test('phone number with 5 digits', () => {
    expect(formatPhone('39495')).toBe('39 49 5')
  })

  test('phone number with 6 digits', () => {
    expect(formatPhone('583949')).toBe('58 39 49')
  })

  test('phone number with 7 digits', () => {
    expect(formatPhone('5839494')).toBe('58 39 49 4')
  })

  test('phone number with 8 digits', () => {
    expect(formatPhone('58394945')).toBe('58 39 49 45')
  })

  test('phone number with 9 digits', () => {
    expect(formatPhone('583949451')).toBe('58 39 49 45 1')
  })

  test('phone number without space', () => {
    expect(formatPhone('0606060606')).toBe('06 06 06 06 06')
  })

  test('phone number with dot separator', () => {
    expect(formatPhone('06.06.06.06.06')).toBe('06 06 06 06 06')
  })

  test('phone number with hyphen separator', () => {
    expect(formatPhone('06-06-06-06-06')).toBe('06 06 06 06 06')
  })

  test('hexagonal france phone number without international code', () => {
    expect(formatPhone('0101010101')).toBe('01 01 01 01 01')
  })

  test('hexagonal france phone number with international code', () => {
    expect(formatPhone('(+33)101010101')).toBe('+33 1 01 01 01 01')
  })

  test('hexagonal france phone number with international code no brackets', () => {
    expect(formatPhone('+33101010101')).toBe('+33 1 01 01 01 01')
  })

  test('martinique phone number without international code', () => {
    expect(formatPhone('0596223344')).toBe('05 96 22 33 44')
  })

  test('martinique phone number with international code', () => {
    expect(formatPhone('(+596)596223344')).toBe('+596 5 96 22 33 44')
  })

  test('martinique phone number with international code no brackets', () => {
    expect(formatPhone('+596596223344')).toBe('+596 5 96 22 33 44')
  })

  test('guadalupe phone number without international code', () => {
    expect(formatPhone('0590010101')).toBe('05 90 01 01 01')
  })

  test('guadalupe phone number with international code', () => {
    expect(formatPhone('(+590)590223344')).toBe('+590 5 90 22 33 44')
  })

  test('guadalupe phone number with international code no brackets', () => {
    expect(formatPhone('+590590223344')).toBe('+590 5 90 22 33 44')
  })

  test('french guyana phone number without international code', () => {
    expect(formatPhone('0594223344')).toBe('05 94 22 33 44')
  })

  test('french guyana phone number with international code', () => {
    expect(formatPhone('(+594)594223344')).toBe('+594 5 94 22 33 44')
  })

  test('french guyana phone number with international code no brackets', () => {
    expect(formatPhone('+594594223344')).toBe('+594 5 94 22 33 44')
  })

  test('reunion island phone number without international code', () => {
    expect(formatPhone('0262223344')).toBe('02 62 22 33 44')
  })

  test('reunion island phone number with international code', () => {
    expect(formatPhone('(+262)262223344')).toBe('+262 2 62 22 33 44')
  })

  test('reunion island phone number with international code no brackets', () => {
    expect(formatPhone('+262262223344')).toBe('+262 2 62 22 33 44')
  })

  test('new caledonia phone number with international code', () => {
    expect(formatPhone('(+687)223344')).toBe('+687 22 33 44')
  })

  test('new caledonia phone number with international code no brackets', () => {
    expect(formatPhone('+687223344')).toBe('+687 22 33 44')
  })

  test('new caledonia phone number with international code already formatted no brackets', () => {
    expect(formatPhone('+687 22 33 44')).toBe('+687 22 33 44')
  })

  test('st-pierre-et-miquelon phone number with international code no brackets', () => {
    expect(formatPhone('+508223344')).toBe('+508 22 33 44')
  })

  test('st-pierre-et-miquelon phone number with international code already formatted no brackets', () => {
    expect(formatPhone('+508 22 33 44')).toBe('+508 22 33 44')
  })

  test('french polynesia phone number with international code', () => {
    expect(formatPhone('(+689)22334455')).toBe('+689 22 33 44 55')
  })

  test('french polynesia phone number with international code  already formatted', () => {
    expect(formatPhone('(+689) 22 33 44 55')).toBe('+689 22 33 44 55')
  })

  test('international phone number from cameroon', () => {
    expect(formatPhone('(+23)701010101')).toBe('+237 01 01 01 01')
  })

  test('international phone number from japan', () => {
    expect(formatPhone('+81 3 1234-5678')).toBe('+813 12 34 56 78')
  })
})
