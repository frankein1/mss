import { describe, test, expect } from 'vitest'
import { formatAddress } from './formatAddress'

describe('formatAddress', () => {
  test('should join all fields with commas', () => {
    expect(
      formatAddress({
        street: '12 rue de la Paix',
        zipcode: '75001',
        city: 'Paris',
        region: 'Ile-de-France'
      })
    ).toBe('12 rue de la Paix, 75001, Paris, Ile-de-France')
  })

  test('should skip null fields', () => {
    expect(
      formatAddress({
        street: '12 rue de la Paix',
        zipcode: null,
        city: 'Paris',
        region: null
      })
    ).toBe('12 rue de la Paix, Paris')
  })

  test('should return empty string when all fields are null', () => {
    expect(
      formatAddress({
        street: null,
        zipcode: null,
        city: null,
        region: null
      } as any)
    ).toBe('')
  })
})
