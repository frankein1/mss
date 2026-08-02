import { describe, test, expect } from 'vitest'
import { routes } from './user'

describe('user routes', () => {
  test('App path returns /app', () => {
    expect(routes.App.path()).toBe('/app')
  })

  describe('AppOverview', () => {
    test('path returns /app/overview without options', () => {
      expect(routes.AppOverview.path()).toBe('/app/overview')
    })

    test('path returns /app/overview with filter option', () => {
      expect(routes.AppOverview.path({ filter: 'active' })).toBe(
        '/app/overview?filter=active'
      )
    })
  })
})
