import { getHeader } from 'h3'
import { useAuth } from '~/composables/useAuth'
import { minutesToMillis } from '~/utils/time'

export default defineNuxtPlugin(async nuxtApp => {
  // use runtimeConfig
  const {
    public: {
      auth: { tokenValidationInMinutes }
    }
  } = useRuntimeConfig()

  const { refreshToken, getSession } = useAuth()

  let nitroPrerender = false
  if (nuxtApp.ssrContext) {
    nitroPrerender =
      getHeader(nuxtApp.ssrContext.event, 'x-nitro-prerender') !== undefined
  }

  const authState = useAuthState()
  // Only fetch session if it was not yet initialized server-side
  if (!authState.isAuthenticated() && !nitroPrerender) {
    await getSession()
  }

  let refreshTokenIntervalTimer: NodeJS.Timeout

  nuxtApp.hook('app:mounted', () => {
    const intervalTime = minutesToMillis(tokenValidationInMinutes / 2)

    refreshTokenIntervalTimer = setInterval(() => {
      if (authState.isAuthenticated()) {
        refreshToken()
      }
    }, intervalTime)
  })

  const _unmount = nuxtApp.vueApp.unmount
  nuxtApp.vueApp.unmount = function () {
    if (refreshTokenIntervalTimer) {
      clearInterval(refreshTokenIntervalTimer)
    }

    _unmount()
  }
})
