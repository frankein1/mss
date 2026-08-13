import { describe, test, expect } from 'vitest'
import { routes, apiProConnectRoutes, apiRdvspRoutes } from './auth'

describe('auth routes', () => {
  test('AuthLogin path returns /auth/login', () => {
    expect(routes.AuthLogin.path()).toBe('/auth/login')
  })

  test('AuthLogout path returns /auth/logout', () => {
    expect(routes.AuthLogout.path()).toBe('/auth/logout')
  })
})

describe('apiProConnectRoutes', () => {
  test('ApiSignIn path returns /api/proconnect/signin', () => {
    expect(apiProConnectRoutes.ApiSignIn.path()).toBe('/api/proconnect/signin')
  })

  test('ApiLogout path returns /api/proconnect/logout', () => {
    expect(apiProConnectRoutes.ApiLogout.path()).toBe('/api/proconnect/logout')
  })

  test('ApiSsoCallback path returns /api/proconnect/login-callback', () => {
    expect(apiProConnectRoutes.ApiSsoCallback.path()).toBe(
      '/api/proconnect/login-callback'
    )
  })

  test('ApiLogoutProconnectOnly path returns /api/proconnect/proconnect-logout', () => {
    expect(apiProConnectRoutes.ApiLogoutProconnectOnly.path()).toBe(
      '/api/proconnect/proconnect-logout'
    )
  })
})

describe('apiRdvspRoutes', () => {
  test('ApiSignIn path returns base path without options', () => {
    expect(apiRdvspRoutes.ApiSignIn.path()).toBe('/api/rdvservicepublic/signin')
  })

  test('ApiSignIn path returns path with query params when options are provided', () => {
    expect(
      apiRdvspRoutes.ApiSignIn.path({ action: 'create', id: 'abc-123' })
    ).toBe('/api/rdvservicepublic/signin?action=create&id=abc-123')
  })

  test('ApiLogout path returns /api/rdvservicepublic/logout', () => {
    expect(apiRdvspRoutes.ApiLogout.path()).toBe('/api/rdvservicepublic/logout')
  })

  test('ApiCallback path returns /api/auth/rdvservicepublic/callback', () => {
    expect(apiRdvspRoutes.ApiCallback.path()).toBe(
      '/api/auth/rdvservicepublic/callback'
    )
  })
})
