import { describe, test, expect } from 'vitest'
import { hasDefinedEmployer } from './hasDefinedEmployer'

describe('hasDefinedEmployer', () => {
  test('should return false when employer is null', () => {
    expect(hasDefinedEmployer({ employer: null })).toBe(false)
  })

  test('should return true when employer is a string', () => {
    expect(hasDefinedEmployer({ employer: 'Etat' })).toBe(true)
  })
})
