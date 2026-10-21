/** Filtered list of headers to be sent forwarded
 * - cookie: authentication
 * - x-real-ip: logger and rate-limiter
 * - x-request-id: logger
 */
export function headerAllowlist() {
  return useRequestHeaders(['cookie', 'x-real-ip', 'x-request-id'])
}
