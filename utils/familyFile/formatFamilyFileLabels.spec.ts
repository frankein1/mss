import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatFamilyFileLabels } from './formatFamilyFileLabels'
import { BeneficiaryFileIdentification } from '~/types/beneficiary'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

test('Labels from family files should be formatted with names, age and relationship status', () => {
  vi.setSystemTime(new Date('2024-07-24'))

  const file: BeneficiaryFileIdentification[] = [
    {
      id: 'membre-principal',
      firstName: 'Camille',
      usualName: 'TEARLE',
      birthName: null,
      birthDate: new Date('1965-11-25'),
      relationship: null
    },
    {
      id: 'conjoint',
      firstName: 'Jean',
      usualName: 'TEARLE',
      birthName: null,
      birthDate: new Date('1969-12-04'),
      relationship: 'Conjoint'
    },
    {
      id: 'enfant-1',
      firstName: 'Etoile',
      usualName: 'TEARLE',
      birthName: null,
      birthDate: new Date('1990-07-07'),
      relationship: 'EnfantMajeur'
    },
    {
      id: 'enfant-2',
      firstName: 'Ariel',
      usualName: 'TEARLE',
      birthName: null,
      birthDate: new Date('2010-01-30'),
      relationship: 'EnfantMineur'
    },
    {
      id: 'grand-pere',
      firstName: 'Fernand',
      usualName: 'TEARLE',
      birthName: null,
      birthDate: new Date('1941-03-25'),
      relationship: 'Grandparent'
    }
  ]

  const labels = formatFamilyFileLabels(file)

  expect(labels).toEqual({
    spouses: ['Camille TEARLE (58 ans)', 'Jean TEARLE (54 ans)'],
    other: [
      'Etoile TEARLE (enfant majeur 34 ans)',
      'Ariel TEARLE (enfant mineur 14 ans)',
      'Fernand TEARLE (grand-parent 83 ans)'
    ]
  })
})
