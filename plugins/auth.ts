import { useAuth } from '~/composables/useAuth'
import { minutesToMillis } from '~/utils/time'

// Security note: this middleware runs client-side only (SPA mode).
// It is a UX redirect, not a security boundary. All data authorization
// is enforced server-side via tRPC protectedProcedure and server/middleware/setContext.ts.
export default defineNuxtPlugin(async nuxtApp => {
  const { getSession } = useAuth()

  const { user } = useAuthState()

  if (!user.value) {
    try {
      await getSession()
    } catch (e) {
      console.error('auth-plugin: failed to fetch session on boot', e)
      // Continue in unauthenticated state; route middleware will redirect to login
    }
  }

  let cleanupVisibilityHandler: (() => void) | undefined
  let cleanupSessionRefreshHandler: NodeJS.Timeout | undefined

  nuxtApp.hook('app:mounted', () => {
    // Token refresh management:
    // - Store in local storage an auth session countdown
    // - Renew the token when it is about to be expired
    cleanupSessionRefreshHandler = handleSessionRefreshOnInterval()
  })

  const _unmount = nuxtApp.vueApp.unmount
  nuxtApp.vueApp.unmount = function () {
    if (cleanupVisibilityHandler) {
      cleanupVisibilityHandler()
    }

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
