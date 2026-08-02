import { describe, test, expect } from 'vitest'
import { formatBeneficiaryName } from './formatBeneficiaryName'

describe('formatBeneficiaryName', () => {
  test('should join firstName and usualName when title is null', () => {
    expect(
      formatBeneficiaryName({
        title: null,
        firstName: 'Marie',
        usualName: 'Dupont'
      })
    ).toBe('Marie Dupont')
  })

  test('should return only firstName when others are absent', () => {
    expect(
      formatBeneficiaryName({
        title: null,
        firstName: 'Marie',
        usualName: null
      } as any)
    ).toBe('Marie')
  })

  test('should return only usualName when firstName is absent', () => {
    expect(
      formatBeneficiaryName({
        title: null,
        firstName: null,
        usualName: 'Dupont'
      } as any)
    ).toBe('Dupont')
  })
})
