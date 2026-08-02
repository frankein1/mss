import { describe, test, expect } from 'vitest'
import { formatBeneficiaryShortenedName } from './formatBeneficiaryShortenedName'

describe('formatBeneficiaryShortenedName', () => {
  test('should capitalize firstName and abbreviate usualName', () => {
    expect(
      formatBeneficiaryShortenedName({
        firstName: 'marie',
        usualName: 'Dupont',
        birthName: null
      })
    ).toBe('Marie D.')
  })

  test('should fall back to birthName when usualName is absent', () => {
    expect(
      formatBeneficiaryShortenedName({
        firstName: 'marie',
        usualName: null,
        birthName: 'Martin'
      })
    ).toBe('Marie M.')
  })

  test('should use fallback when firstName is missing', () => {
    expect(
      formatBeneficiaryShortenedName({
        firstName: undefined,
        usualName: 'Dupont',
        birthName: null
      })
    ).toBe('Non renseigné D.')
  })

  test('should handle both names missing', () => {
    expect(
      formatBeneficiaryShortenedName({
        firstName: undefined,
        usualName: null,
        birthName: null
      })
    ).toBe('Non renseigné .')
  })
})
