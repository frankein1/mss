import { describe, test, expect } from 'vitest'
import { hasAdditionalInformations } from './hasAdditionalInformations'

describe('hasAdditionalInformations', () => {
  test('should return false when additionalInformation is null', () => {
    expect(hasAdditionalInformations({ additionalInformation: null })).toBe(
      false
    )
  })

  test('should return true when additionalInformation is set', () => {
    expect(
      hasAdditionalInformations({ additionalInformation: 'some text' })
    ).toBe(true)
  })
})
