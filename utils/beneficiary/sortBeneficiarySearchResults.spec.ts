import { describe, test, expect } from 'vitest'
import sortBeneficiarySearchResults from './sortBeneficiarySearchResults'

describe('sortBeneficiarySearchResults', () => {
  test('should rank usualName match above birthName match', () => {
    const a = { usualName: 'Martin', birthName: null, firstName: null } as any
    const b = { usualName: null, birthName: 'Martin', firstName: null } as any
    const sorted = [a, b].sort(sortBeneficiarySearchResults('martin'))
    expect(sorted[0]).toBe(a)
  })

  test('should rank birthName match above firstName match', () => {
    const a = { usualName: null, birthName: 'Dupont', firstName: null } as any
    const b = { usualName: null, birthName: null, firstName: 'Dupont' } as any
    const sorted = [a, b].sort(sortBeneficiarySearchResults('dupont'))
    expect(sorted[0]).toBe(a)
  })

  test('should sort alphabetically on usualName when scores are equal', () => {
    const a = { usualName: 'albert', birthName: null, firstName: null } as any
    const b = { usualName: 'bernard', birthName: null, firstName: null } as any
    const sorted = [a, b].sort(sortBeneficiarySearchResults('xxx'))
    expect(sorted[0]).toBe(a)
  })

  test('should match accent-insensitively', () => {
    const accented = {
      usualName: 'éric',
      birthName: null,
      firstName: null
    } as any
    const noMatch = {
      usualName: 'zzz',
      birthName: null,
      firstName: null
    } as any
    const sorted = [noMatch, accented].sort(
      sortBeneficiarySearchResults('eric')
    )
    expect(sorted[0]).toBe(accented)
  })

  test('should rank no-match lowest', () => {
    const match = {
      usualName: 'Dupont',
      birthName: null,
      firstName: null
    } as any
    const noMatch = {
      usualName: 'Martin',
      birthName: null,
      firstName: null
    } as any
    const sorted = [noMatch, match].sort(sortBeneficiarySearchResults('dupont'))
    expect(sorted[0]).toBe(match)
  })
})
