/**
 * Validates that a redirect URL is a safe relative path within the application.
 *
 * Rejects:
 * - Absolute URLs (contain "://")
 * - Protocol-relative URLs (start with "//")
 * - URLs containing "@" — prevents user@host attacks where browsers interpret
 *   the portion before "@" as credentials and route to an external host
 *   (e.g. "https://app.example.com@evil.com" resolves to "evil.com")
 */
export function isSafeRedirectUrl(url: string): boolean {
  if (!url.startsWith('/')) {
    return false
  }
  if (url.startsWith('//')) {
    return false
  }
  if (url.includes('@')) {
    return false
  }
  if (url.includes('://')) {
    return false
  }
  return true
}
