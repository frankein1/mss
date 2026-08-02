import { afterEach, beforeEach, describe, test, expect, vi } from 'vitest'
import { formatBeneficiaryBirthInfo } from './formatBeneficiaryBirthInfo'

describe('formatBeneficiaryBirthInfo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-06-15'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('should return empty string when both fields are null', () => {
    expect(
      formatBeneficiaryBirthInfo({ birthDate: null, birthPlace: null })
    ).toBe('')
  })

  test('should format birthDate with age in plural', () => {
    expect(
      formatBeneficiaryBirthInfo({
        birthDate: new Date('1990-01-01'),
        birthPlace: null
      })
    ).toBe('Né(e) le 01/01/1990 (34 ans)')
  })

  test('should format birthPlace only', () => {
    expect(
      formatBeneficiaryBirthInfo({ birthDate: null, birthPlace: 'Paris' })
    ).toBe('Né(e) à Paris')
  })

  test('should format both birthDate and birthPlace', () => {
    expect(
      formatBeneficiaryBirthInfo({
        birthDate: new Date('1990-01-01'),
        birthPlace: 'Paris'
      })
    ).toBe('Né(e) le 01/01/1990 (34 ans) à Paris')
  })

  test('should use singular "an" when age is 1', () => {
    expect(
      formatBeneficiaryBirthInfo({
        birthDate: new Date('2023-06-01'),
        birthPlace: null
      })
    ).toBe('Né(e) le 01/06/2023 (1 an)')
  })
})
