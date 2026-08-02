import { describe, test, expect } from 'vitest'
import { hasMobilityInformations } from './hasMobilityInformations'

describe('hasMobilityInformations', () => {
  test('should return false when mobility is null', () => {
    expect(hasMobilityInformations({ mobility: null } as any)).toBe(false)
  })

  test('should return true when mobility is set', () => {
    expect(
      hasMobilityInformations({ mobility: 'PermitWithVehicle' } as any)
    ).toBe(true)
  })
})
