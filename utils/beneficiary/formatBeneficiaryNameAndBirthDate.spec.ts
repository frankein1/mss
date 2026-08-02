import { describe, test, expect } from 'vitest'
import { formatBeneficiaryNameAndBirthDate } from './formatBeneficiaryNameAndBirthDate'

describe('formatBeneficiaryNameAndBirthDate', () => {
  test('should return display name only when birthDate is absent', () => {
    expect(
      formatBeneficiaryNameAndBirthDate({
        firstName: 'Marie',
        usualName: 'Dupont',
        birthName: null,
        birthDate: null
      })
    ).toBe('Marie DUPONT')
  })

  test('should append formatted birthDate when present', () => {
    expect(
      formatBeneficiaryNameAndBirthDate({
        firstName: 'Marie',
        usualName: 'Dupont',
        birthName: null,
        birthDate: new Date('1990-01-01')
      })
    ).toBe('Marie DUPONT - 01/01/1990')
  })
})
