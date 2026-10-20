/** Incoming request seen by the `#app/composables/ssr` composables, mocked
 * globally in test/components/setup.ts: modules loaded at app boot (e.g.
 * app/plugins/trpcClient.ts → ~/utils/api/header-allowlist) are cached by
 * the first spec file, so a per-file mock would never reach them
 */
export const fakeRequest = {
  // Undefined on the client, the H3 event during SSR
  event: undefined as object | undefined,
  headers: {} as Record<string, string>,
  // Simulates a call outside the Nuxt context (e.g. from a setTimeout)
  nuxtContextLost: false
}

export function resetFakeRequest() {
  fakeRequest.event = undefined
  fakeRequest.headers = {}
  fakeRequest.nuxtContextLost = false
}
