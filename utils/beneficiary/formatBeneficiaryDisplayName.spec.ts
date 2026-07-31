import { describe, test, expect } from 'vitest'
import { formatBeneficiaryDisplayName } from './formatBeneficiaryDisplayName'

describe('formatBeneficiaryDisplayName', () => {
  test('should display firstName then usualName uppercased', () => {
    expect(
      formatBeneficiaryDisplayName({
        firstName: 'Marie',
        usualName: 'Dupont',
        birthName: null
      })
    ).toBe('Marie DUPONT')
  })

  test('should display birthName in parentheses when usualName is absent', () => {
    expect(
      formatBeneficiaryDisplayName({
        firstName: 'Marie',
        usualName: null,
        birthName: 'Martin'
      })
    ).toBe('Marie (MARTIN)')
  })

  test('should prefer usualName over birthName', () => {
    expect(
      formatBeneficiaryDisplayName({
        firstName: 'Marie',
        usualName: 'Dupont',
        birthName: 'Martin'
      })
    ).toBe('Marie DUPONT')
  })

  test('should display only firstName when both names are absent', () => {
    expect(
      formatBeneficiaryDisplayName({
        firstName: 'Marie',
        usualName: null,
        birthName: null
      })
    ).toBe('Marie (non renseigné)')
  })

  test('should reverse order when lastNameFirst is true', () => {
    expect(
      formatBeneficiaryDisplayName(
        { firstName: 'Marie', usualName: 'Dupont', birthName: null },
        true
      )
    ).toBe('DUPONT Marie')
  })

  test('should handle undefined firstName with lastNameFirst', () => {
    expect(
      formatBeneficiaryDisplayName(
        { firstName: undefined, usualName: 'Dupont', birthName: null },
        true
      )
    ).toBe('DUPONT (non renseigné)')
  })

  test('should handle all fields undefined', () => {
    const result = formatBeneficiaryDisplayName({})
    expect(result).toBe('(non renseigné) (non renseigné)')
  })
})
