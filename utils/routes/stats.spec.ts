import { describe, test, expect } from 'vitest'
import { routes } from './stats'

describe('stats routes', () => {
  test('AppStats path returns /app/stats', () => {
    expect(routes.AppStats.path()).toBe('/app/stats')
  })

  test('AppStatsBeneficiaries path returns /app/stats/beneficiaries', () => {
    expect(routes.AppStatsBeneficiaries.path()).toBe('/app/stats/beneficiaries')
  })

  test('AppStatsFollowups path returns /app/stats/followups', () => {
    expect(routes.AppStatsFollowups.path()).toBe('/app/stats/followups')
  })

  test('AppStatsFileInstructions path returns /app/stats/file-instructions', () => {
    expect(routes.AppStatsFileInstructions.path()).toBe(
      '/app/stats/file-instructions'
    )
  })

  test('AppStatsWorkshops path returns /app/stats/workshops', () => {
    expect(routes.AppStatsWorkshops.path()).toBe('/app/stats/workshops')
  })
})
