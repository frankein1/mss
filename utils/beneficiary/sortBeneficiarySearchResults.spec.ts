import { describe, test, expect } from 'vitest'
import sortBeneficiarySearchResults from './sortBeneficiarySearchResults'

const base = {
  id: 'random-id',
  familyFileId: 'family-id',
  status: 'Active' as const,
  birthDate: new Date('1970-01-01'),
  fileNumber: '1234',
  numeroPegase: '',
  phone1: '0101010101'
}

describe('sortBeneficiarySearchResults', () => {
  test('should rank usualName match above birthName match', () => {
    const a = { ...base, usualName: 'Martin', birthName: null, firstName: null }
    const b = { ...base, usualName: null, birthName: 'Martin', firstName: null }
    const sorted = [a, b].sort(sortBeneficiarySearchResults('martin'))
    expect(sorted[0]).toBe(a)
  })

  test('should rank birthName match above firstName match', () => {
    const a = { ...base, usualName: null, birthName: 'Dupont', firstName: null }
    const b = { ...base, usualName: null, birthName: null, firstName: 'Dupont' }
    const sorted = [a, b].sort(sortBeneficiarySearchResults('dupont'))
    expect(sorted[0]).toBe(a)
  })

  test('should sort alphabetically on usualName when scores are equal', () => {
    const a = { ...base, usualName: 'albert', birthName: null, firstName: null }
    const b = {
      ...base,
      usualName: 'bernard',
      birthName: null,
      firstName: null
    }
    const sorted = [a, b].sort(sortBeneficiarySearchResults('xxx'))
    expect(sorted[0]).toBe(a)
  })

  test('should match accent-insensitively', () => {
    const accented = {
      ...base,
      usualName: 'éric',
      birthName: null,
      firstName: null
    }
    const noMatch = {
      ...base,
      usualName: 'zzz',
      birthName: null,
      firstName: null
    }
    const sorted = [noMatch, accented].sort(
      sortBeneficiarySearchResults('eric')
    )
    expect(sorted[0]).toBe(accented)
  })

  test('should rank no-match lowest', () => {
    const match = {
      ...base,
      usualName: 'Dupont',
      birthName: null,
      firstName: null
    }
    const noMatch = {
      ...base,
      usualName: 'Martin',
      birthName: null,
      firstName: null
    }
    const sorted = [noMatch, match].sort(sortBeneficiarySearchResults('dupont'))
    expect(sorted[0]).toBe(match)
  })
})
