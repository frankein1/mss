import { describe, test, expect } from 'vitest'
import { hasCoordinatesInformations } from './hasCoordinatesInformations'

describe('hasCoordinatesInformations', () => {
  const empty = {
    street: null,
    zipcode: null,
    city: null,
    region: null,
    noPhone: false,
    phone1: null,
    phone2: null,
    email: null,
    addressComplement: null
  }

  test('should return falsy when all fields are null', () => {
    expect(hasCoordinatesInformations(empty)).toBeFalsy()
  })

  test('should return truthy when all fields are populated', () => {
    expect(
      hasCoordinatesInformations({
        street: '12 rue de la Paix',
        zipcode: '75001',
        city: 'Paris',
        region: 'IDF',
        noPhone: true,
        phone1: '0601020304',
        phone2: '0605060708',
        email: 'test@test.fr',
        addressComplement: 'Apt 3'
      })
    ).toBeTruthy()
  })

  test('should return truthy when only phone1 is populated', () => {
    expect(
      hasCoordinatesInformations({ ...empty, phone1: '0601020304' })
    ).toBeTruthy()
  })
})
