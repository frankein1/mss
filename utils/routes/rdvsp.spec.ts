import { describe, test, expect } from 'vitest'
import { routes } from './rdvsp'

describe('rdvsp routes', () => {
  test('AppRdvspAfterSignIn path returns base path without options', () => {
    expect(routes.AppRdvspAfterSignIn.path()).toBe('/app/integrations/rdvsp')
  })

  test('AppRdvspAfterSignIn path returns path with query params when options are provided', () => {
    expect(
      routes.AppRdvspAfterSignIn.path({ action: 'create', id: 'abc-123' })
    ).toBe('/app/integrations/rdvsp?action=create&id=abc-123')
  })
})
