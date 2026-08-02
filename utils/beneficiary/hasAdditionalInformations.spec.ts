import { describe, test, expect } from 'vitest'
import { hasAdditionalInformations } from './hasAdditionalInformations'

describe('hasAdditionalInformations', () => {
  test('should return false when additionalInformation is null', () => {
    expect(
      hasAdditionalInformations({ additionalInformation: null } as any)
    ).toBe(false)
  })

  test('should return true when additionalInformation is set', () => {
    expect(
      hasAdditionalInformations({ additionalInformation: 'some text' } as any)
    ).toBe(true)
  })
})
