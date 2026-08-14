import { describe, test, expect } from 'vitest'
import { hasDefinedCity } from './hasDefinedCity'

describe('hasDefinedCity', () => {
  test('should return false when city is null', () => {
    expect(hasDefinedCity({ city: null })).toBe(false)
  })

  test('should return true when city is a string', () => {
    expect(hasDefinedCity({ city: 'Paris' })).toBe(true)
  })
})
