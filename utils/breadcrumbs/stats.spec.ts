import { describe, test, expect } from 'vitest'
import { breadcrumbs } from './stats'

describe('stats breadcrumbs', () => {
  test('AppStats returns overview + stats', () => {
    expect(breadcrumbs.AppStats()).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Statistiques', to: '/app/stats' }
    ])
  })
})
