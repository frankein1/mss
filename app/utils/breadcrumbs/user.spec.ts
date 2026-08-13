import { describe, test, expect } from 'vitest'
import { breadcrumbs } from './user'

describe('user breadcrumbs', () => {
  test('AppOverview returns tableau de bord', () => {
    expect(breadcrumbs.AppOverview()).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' }
    ])
  })
})
