import { describe, test, expect } from 'vitest'
import { formatBeneficiaryDisplayPhone } from './formatBeneficiaryDisplayPhone'

describe('formatBeneficiaryDisplayPhone', () => {
  test('should return phone1 only when phone2 is absent', () => {
    expect(
      formatBeneficiaryDisplayPhone({ phone1: '0601020304', phone2: null })
    ).toBe('0601020304')
  })

  test('should join phone1 and phone2 with separator', () => {
    expect(
      formatBeneficiaryDisplayPhone({
        phone1: '0601020304',
        phone2: '0605060708'
      })
    ).toBe('0601020304 / 0605060708')
  })
})
