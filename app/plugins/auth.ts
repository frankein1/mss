import { getHeader } from 'h3'
import { useAuth } from '~/composables/useAuth'
import { minutesToMillis } from '~/utils/time'

export default defineNuxtPlugin(async nuxtApp => {
  const { getSession } = useAuth()

  let nitroPrerender = false
  if (nuxtApp.ssrContext) {
    nitroPrerender =
      getHeader(nuxtApp.ssrContext.event, 'x-nitro-prerender') !== undefined
  }

  const { user } = useAuthState()

  // Only fetch session if it was not yet initialized server-side
  if (!user.value && !nitroPrerender) {
    // For the time being the session is renewed on app load to avoid problems with
    // expired tokens
    await getSession()
  }

  let cleanupSessionRefreshHandler: NodeJS.Timeout | undefined

  nuxtApp.hook('app:mounted', () => {
    // Token refresh management:
    // - Store in local storage an auth session countdown
    // - Renew the token when it is about to be expired
    cleanupSessionRefreshHandler = handleSessionRefreshOnInterval()
  })

  const _unmount = nuxtApp.vueApp.unmount
  nuxtApp.vueApp.unmount = function () {
    if (cleanupSessionRefreshHandler) {
      clearInterval(cleanupSessionRefreshHandler)
    }

    user.value = null

    _unmount()
  }
})

function handleSessionRefreshOnInterval() {
  if (!import.meta.client) {
    console.warn(
      'auth-management: not on client. handleSessionRefreshOnInterval can only be executed onMounted'
    )
    return
  }

  const {
    public: {
      auth: { tokenValidationInMinutes }
    }
  } = useRuntimeConfig()

  const { refreshToken, logout } = useAuth()
  const { isAuthenticated } = useAuthState()

  const intervalTime = minutesToMillis(tokenValidationInMinutes / 2)

  const timer = setInterval(async () => {
    if (isAuthenticated()) {
      try {
        await refreshToken()
      } catch (e) {
        console.error('auth-management: failure to refresh session', e)
        logout()
        if (timer) {
          clearInterval(timer)
        }
        throw e
      }
    } else {
      console.log(
        'auth-management: handleSessionRefreshOnInterval not authenticated'
      )
      if (timer) {
        clearInterval(timer)
      }
    }
  }, intervalTime)

  return timer
}
