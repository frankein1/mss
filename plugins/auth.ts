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

  const { user } = useAuthState()
  // Only fetch session if it was not yet initialized server-side
  if (!user.value && !nitroPrerender) {
    await getSession()
  }

  // Listen for when the page is visible, if the user switches tabs
  // and makes our tab visible again, re-fetch the session
  const visibilityHandler = () => {
    getSession()
  }

  let refreshTokenIntervalTimer: NodeJS.Timeout

  nuxtApp.hook('app:mounted', () => {
    document.addEventListener('visibilitychange', visibilityHandler, false)

    const intervalTime = minutesToMillis(tokenValidationInMinutes / 2)

    refreshTokenIntervalTimer = setInterval(() => {
      if (user.value) {
        refreshToken()
      }
    }, intervalTime)
  })

  const _unmount = nuxtApp.vueApp.unmount
  nuxtApp.vueApp.unmount = function () {
    // Clear visibility handler
    document.removeEventListener('visibilitychange', visibilityHandler, false)

    if (refreshTokenIntervalTimer) {
      clearInterval(refreshTokenIntervalTimer)
    }

    user.value = null

    _unmount()
  }
})
