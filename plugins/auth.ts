import { getHeader } from 'h3'
import { useAuth } from '~/composables/useAuth'
import { minutesToMillis } from '~/utils/time'
import { useEventListener, useLocalStorage } from '@vueuse/core'
import type { WatchHandle } from 'vue'
import {
  COUNTDOWN_SESSION_LABEL,
  DEFAULT_INTERVAL_TIME_FOR_STORAGE_REFRESH
} from '~/utils/constants'

export default defineNuxtPlugin(async nuxtApp => {
  const { verifySession } = useAuth()

  let nitroPrerender = false
  if (nuxtApp.ssrContext) {
    nitroPrerender =
      getHeader(nuxtApp.ssrContext.event, 'x-nitro-prerender') !== undefined
  }

  const { user } = useAuthState()

  // Only fetch session if it was not yet initialized server-side
  if (!user.value && !nitroPrerender) {
    await verifySession()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let cleanupVisibilityHandler: (() => void) | undefined
  let cleanupSessionRefreshHandler: (() => void) | undefined

  nuxtApp.hook('app:mounted', () => {
    // Listen for when the page is visible, if the user switches tabs
    // and makes our tab visible again, renew the session
    // cleanupVisibilityHandler = handleSessionRefreshOnTabVisibilityChange()

    // Token refresh management:
    // - Store in local storage an auth session countdown
    // - Renew the token when it is about to be expired
    cleanupSessionRefreshHandler = handleSessionRefreshOnInterval()
  })

  const _unmount = nuxtApp.vueApp.unmount
  nuxtApp.vueApp.unmount = function () {
    // Deactivated: waiting to see if this is really useful
    // if (cleanupVisibilityHandler) {
    //   cleanupVisibilityHandler()
    // }

    if (cleanupSessionRefreshHandler) {
      cleanupSessionRefreshHandler()
    }

    user.value = null

    _unmount()
  }
})

/**
 * When visibility change for tab, renew the session
 * */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handleSessionRefreshOnTabVisibilityChange() {
  if (!import.meta.client) {
    console.warn(
      'auth-management: not on client. handleSessionRefreshOnTabVisibilityChange can only be executed onMounted'
    )
    return
  }

  const { refreshToken } = useAuth()
  const { isAuthenticated } = useAuthState()

  return useEventListener(document, 'visibilitychange', () => {
    if (isAuthenticated()) {
      return refreshToken
    }
  })
}

function handleSessionRefreshOnInterval(
  intervalTimeInMs = DEFAULT_INTERVAL_TIME_FOR_STORAGE_REFRESH
) {
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

  const initial = minutesToMillis(tokenValidationInMinutes)

  // The session counter is stored in local storage in order to manage several tabs
  const countdown = useLocalStorage(COUNTDOWN_SESSION_LABEL, initial)

  let timer: NodeJS.Timeout
  let unwatch: WatchHandle

  function setTimer() {
    // Initialize countdown
    resetSessionTimer()

    // Every intervalTimeInMs the counter is decremented
    timer = setInterval(() => {
      countdown.value = countdown.value - intervalTimeInMs
    }, intervalTimeInMs)

    // Number of trials for refresh token before cleaning up session
    let ntrial = 0

    unwatch = watch(countdown, async () => {
      if (isAuthenticated()) {
        // Refresh token when session will expire in less than 10 minutes
        const sessionExpiresIn10min = countdown.value < minutesToMillis(10)

        if (!sessionExpiresIn10min) {
          return
        }

        console.log(
          'auth-management: refresh token in handleSessionRefreshOnInterval, trial',
          ntrial,
          'countdown',
          countdown.value
        )
        try {
          await refreshToken()
          ntrial = 0
          resetSessionTimer()
        } catch (e) {
          console.error(e)
          if (ntrial < 2) {
            ntrial++
          } else {
            console.error(
              'auth-management: failure to refresh session after',
              ntrial,
              'retries'
            )
            ntrial = 0
            logout()
            cleanup()
          }
        }
      } else {
        console.log(
          'auth-management: handleSessionRefreshOnInterval not authenticated'
        )
        cleanup()
      }
    })
  }

  function cleanup() {
    console.debug('auth-management: cleanup')
    if (unwatch) {
      unwatch()
    }
    if (timer) {
      clearInterval(timer)
    }
    countdown.value = undefined
    localStorage.removeItem(COUNTDOWN_SESSION_LABEL)
  }

  function resetSessionTimer() {
    countdown.value = initial
  }

  // Initialize
  setTimer()

  return cleanup
}
