import { describe, test, expect } from 'vitest'
import { formatBeneficiarySearchDisplayName } from './formatBeneficiarySearchDisplayName'

describe('formatBeneficiarySearchDisplayName', () => {
  const base = {
    id: '1',
    birthDate: new Date('1990-01-01')
  }

  test('should display usualName, birthName in parens, and firstName when both names exist', () => {
    expect(
      formatBeneficiarySearchDisplayName({
        ...base,
        firstName: 'Marie',
        usualName: 'Dupont',
        birthName: 'Martin'
      })
    ).toBe('DUPONT (MARTIN) Marie')
  })

  test('should display only birthName and firstName when usualName is absent', () => {
    expect(
      formatBeneficiarySearchDisplayName({
        ...base,
        firstName: 'Marie',
        usualName: null,
        birthName: 'Martin'
      })
    ).toBe('MARTIN Marie')
  })

  test('should display only usualName and firstName when birthName is absent', () => {
    expect(
      formatBeneficiarySearchDisplayName({
        ...base,
        firstName: 'Marie',
        usualName: 'Dupont',
        birthName: null
      })
    ).toBe('DUPONT Marie')
  })

  test('should return only firstName when both names are absent', () => {
    expect(
      formatBeneficiarySearchDisplayName({
        ...base,
        firstName: 'Marie',
        usualName: null,
        birthName: null
      })
    ).toBe('Marie')
  })

  test('should return empty string when all fields are null', () => {
    expect(
      formatBeneficiarySearchDisplayName({
        ...base,
        firstName: null,
        usualName: null,
        birthName: null
      } as any)
    ).toBe('')
  })
})
