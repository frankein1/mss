import { describe, test, expect } from 'vitest'
import { getFormIcon } from './getFormIcon'

describe('getFormIcon', () => {
  test('should return user icon for 0 members', () => {
    expect(getFormIcon(0)).toBe('fr-icon-user-line')
  })

  test('should return user icon for 1 member', () => {
    expect(getFormIcon(1)).toBe('fr-icon-user-line')
  })

  test('should return group icon for 2 members', () => {
    expect(getFormIcon(2)).toBe('fr-icon-group-line')
  })

  test('should return group icon for 5 members', () => {
    expect(getFormIcon(5)).toBe('fr-icon-group-line')
  })
})
