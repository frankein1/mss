import { describe, expect, it } from 'vitest'
import { isSafeRedirectUrl } from './isSafeRedirectUrl'

describe('isSafeRedirectUrl', () => {
  it.each([
    '/app/beneficiaries',
    '/app/beneficiaries/123?tab=followup',
    '/app/workshops#UpcomingWorkshops',
    '/app/history',
    '/admin',
    '/admin/users',
    '/cgu/user',
    '/cgu/manager',
    '/plan-du-site',
    '/politique-confidentialite'
  ])('accepts safe in-app path: %s', url => {
    expect(isSafeRedirectUrl(url)).toBe(true)
  })

  it.each([
    // paths outside the app
    '/auth/login',
    '/',
    // absolute URLs
    'https://evil.com',
    'http://evil.com/app/path',
    // protocol-relative — including ones mirroring the dummy base domain
    '//evil.com',
    '//evil.com/app/path',
    '//x/app',
    // user@host tricks
    '//user@evil.com/app',
    // backslash normalization (browsers convert \\ to /)
    '/\\evil.com',
    // percent-encoded double-slash
    '/%2F%2Fevil.com',
    // CRLF injection
    '/app\r\nLocation: https://evil.com',
    // control characters stripped silently by WHATWG URL parser
    '/app\t/../admin',
    '/app\n/../admin',
    // null byte — server-side libs may truncate path at \0
    '/app\x00.evil.com',
    '/app%00.evil.com',
    // excessively long URL
    '/' + 'a'.repeat(2049),
    // characters not in allowlist
    '@google.com',
    '/app/foo@evil.com',
    '/app/foo;bar',
    '/app/foo:bar',
    '/app/<script>',
    '/app/foo bar',
    // non-ASCII (direct and percent-encoded)
    '/app/ñ',
    '/app/%C3%B1',
    // no leading slash
    'app/beneficiaries',
    ''
  ])('rejects unsafe URL: %s', url => {
    expect(isSafeRedirectUrl(url)).toBe(false)
  })
})
