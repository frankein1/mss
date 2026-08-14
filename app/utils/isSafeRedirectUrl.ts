import { AppRoute } from '~/utils/routes/utils'
import { AdminRoute } from './routes/admin'

const SAFE_PREFIXES = [
  AppRoute, // /app
  AdminRoute, // /admin
  '/cgu',
  '/plan-du-site',
  '/politique-confidentialite'
] as const

// Prevents log injection and edge-case buffer issues with unusually long paths
const MAX_URL_LENGTH = 2048

// Rejects control characters (0x00–0x1F, 0x7F) and non-ASCII (0x80+).
// The WHATWG URL parser silently strips tabs/newlines before parsing —
// without this, /app\t/../admin normalizes to /admin and passes the prefix check.
// Applied to both the raw URL and its decoded form to catch percent-encoded
// variants like %00 (null byte) or %C3%A9 (é).
// eslint-disable-next-line no-control-regex
const NON_ASCII_OR_CONTROL_RE = /[\x00-\x1F\x7F-\uFFFF]/

// Allowlist: only RFC 3986 characters that legitimately appear in app paths.
// Excludes @ (user@host attacks), ; : ! $ ' ( ) * , (not used in app routes).
// All query params go through URLSearchParams so they are percent-encoded.
const ALLOWED_CHARS_RE = /^[A-Za-z0-9\-._~/?=&#%+]+$/

/**
 * Validates that a redirect URL is a safe in-app path.
 *
 * Uses the URL API with a throwaway base to normalize the input before
 * checking its prefix — this handles encoding tricks, backslash
 * normalization, and protocol-relative bypasses at the parser level.
 */
export function isSafeRedirectUrl(url: string): boolean {
  let decoded: string
  try {
    decoded = decodeURIComponent(url)
  } catch {
    return false
  }

  if (
    typeof url !== 'string' ||
    url.length > MAX_URL_LENGTH ||
    !ALLOWED_CHARS_RE.test(url) ||
    !url.startsWith('/') ||
    url.startsWith('//') ||
    NON_ASCII_OR_CONTROL_RE.test(decoded)
  ) {
    return false
  }
  try {
    const parsed = new URL(url, 'https://x')
    if (parsed.hostname !== 'x') {
      return false
    }
    return SAFE_PREFIXES.some(prefix => parsed.pathname.startsWith(prefix))
  } catch {
    return false
  }
}
