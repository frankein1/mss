import { describe, test, expect } from 'vitest'
import { hasIdentityInformations } from './hasIdentityInformations'

describe('hasIdentityInformations', () => {
  const empty = {
    title: null,
    usualName: null,
    firstName: null,
    birthDate: null,
    birthPlace: null,
    gender: null,
    birthName: null,
    nationality: null,
    deathDate: null,
    numeroPegase: null
  } as any

  test('should return falsy when all fields are null', () => {
    expect(hasIdentityInformations(empty)).toBeFalsy()
  })

  test('should return truthy when all fields are populated', () => {
    expect(
      hasIdentityInformations({
        title: 'Mr',
        usualName: 'Dupont',
        firstName: 'Marie',
        birthDate: new Date(),
        birthPlace: 'Paris',
        gender: 'Female',
        birthName: 'Martin',
        nationality: 'French',
        deathDate: new Date(),
        numeroPegase: '123'
      } as any)
    ).toBeTruthy()
  })

  test('should return truthy when a single field is populated', () => {
    expect(
      hasIdentityInformations({ ...empty, firstName: 'Marie' })
    ).toBeTruthy()
  })
})
