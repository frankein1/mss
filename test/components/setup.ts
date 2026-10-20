import { vi } from 'vitest'
import { fakeRequest } from '~~/test/components/fake-request'

// Driven by test/components/fake-request.ts; never mock these per spec file,
// a second mock of #app/composables/ssr would override this one
vi.mock('#app/composables/ssr', async importOriginal => {
  // Outside the nuxt environment (e.g. happy-dom specs) there is no Nuxt app
  // and the real module throws on import. Temporary: remove this guard once
  // all specs run in the nuxt environment (MultiSelect.spec.ts is the last one)
  if (!window.__NUXT_VITEST_ENVIRONMENT__) {
    return {}
  }
  return {
    ...(await importOriginal<typeof import('#app/composables/ssr')>()),
    useRequestEvent: () => fakeRequest.event,
    useRequestHeaders: (include?: string[]) => {
      if (fakeRequest.nuxtContextLost) {
        throw new Error('[nuxt] instance unavailable')
      }
      return Object.fromEntries(
        Object.entries(fakeRequest.headers).filter(
          ([key]) => !include || include.includes(key)
        )
      )
    }
  }
})
