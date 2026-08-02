import { describe, test, expect } from 'vitest'
import { routes } from './cgu'

describe('cgu routes', () => {
  describe('CGUManager', () => {
    test('path returns /cgu/manager without options', () => {
      expect(routes.CGUManager.path()).toBe('/cgu/manager')
    })

    test('path returns /cgu/manager with readonly option', () => {
      expect(routes.CGUManager.path({ readonly: true })).toBe(
        '/cgu/manager?readonly=true'
      )
    })

    test('path returns /cgu/manager with showSummary option', () => {
      expect(routes.CGUManager.path({ showSummary: true })).toBe(
        '/cgu/manager?showSummary=true'
      )
    })

    test('path returns /cgu/manager with both options', () => {
      expect(
        routes.CGUManager.path({ readonly: true, showSummary: true })
      ).toBe('/cgu/manager?readonly=true&showSummary=true')
    })

    test('path returns /cgu/manager with empty object', () => {
      expect(routes.CGUManager.path({})).toBe('/cgu/manager')
    })
  })

  describe('CGUUser', () => {
    test('path returns /cgu/user without options', () => {
      expect(routes.CGUUser.path()).toBe('/cgu/user')
    })

    test('path returns /cgu/user with readonly option', () => {
      expect(routes.CGUUser.path({ readonly: true })).toBe(
        '/cgu/user?readonly=true'
      )
    })

    test('path returns /cgu/user with showSummary option', () => {
      expect(routes.CGUUser.path({ showSummary: true })).toBe(
        '/cgu/user?showSummary=true'
      )
    })

    test('path returns /cgu/user with both options', () => {
      expect(routes.CGUUser.path({ readonly: true, showSummary: true })).toBe(
        '/cgu/user?readonly=true&showSummary=true'
      )
    })

    test('path returns /cgu/user with empty object', () => {
      expect(routes.CGUUser.path({})).toBe('/cgu/user')
    })
  })
})
