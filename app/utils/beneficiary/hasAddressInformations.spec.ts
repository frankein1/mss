import { describe, test, expect } from 'vitest'
import { hasAddressInformations } from './hasAddressInformations'

describe('hasAddressInformations', () => {
  const empty = {
    accommodationMode: null,
    accommodationAdditionalInformation: null,
    accommodationZone: null,
    street: null,
    zipcode: null,
    city: null,
    region: null,
    department: null,
    qpv: null
  }

  test('should return falsy when all fields are null', () => {
    expect(hasAddressInformations(empty)).toBeFalsy()
  })

  test('should return truthy when all fields are populated', () => {
    expect(
      hasAddressInformations({
        accommodationMode: 'Owner',
        accommodationAdditionalInformation: 'RDC',
        accommodationZone: 'France',
        street: '12 rue de la Paix',
        zipcode: '75001',
        city: 'Paris',
        region: 'IDF',
        department: '75',
        qpv: true
      })
    ).toBeTruthy()
  })

  test('should return truthy when a single field is populated', () => {
    expect(hasAddressInformations({ ...empty, city: 'Paris' })).toBeTruthy()
  })
})
