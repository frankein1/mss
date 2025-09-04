import { getHeader } from 'h3'
import { useAuth } from '~/composables/useAuth'
import { minutesToMillis } from '~/utils/time'
import { useEventListener, useLocalStorage } from '@vueuse/core'
import type { WatchHandle } from 'vue'
import {
  COUNTDOWN_INACTIVITY_LABEL,
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

  let cleanupVisibilityHandler: (() => void) | undefined
  let cleanupSessionRefreshHandler: (() => void) | undefined

  nuxtApp.hook('app:mounted', () => {
    // Listen for when the page is visible, if the user switches tabs
    // and makes our tab visible again, renew the session
    cleanupVisibilityHandler = handleSessionRefreshOnTabVisibilityChange()

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
      cleanupSessionRefreshHandler()
    }

    user.value = null

    _unmount()
  }
})

/**
 * When visibility change for tab, renew the session
 * */
function handleSessionRefreshOnTabVisibilityChange() {
  if (!import.meta.client) {
    console.warn(
      'auth-management: not on client. handleSessionRefreshOnTabVisibilityChange can only be executed onMounted'
    )
    return
  }

  const { refreshToken } = useAuth()
  return useEventListener(document, 'visibilitychange', refreshToken)
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
      disconnect: { threshold },
      auth: { tokenValidationInMinutes }
    }
  } = useRuntimeConfig()

  const { refreshToken } = useAuth()
  const { user } = useAuthState()

  const initial = minutesToMillis(tokenValidationInMinutes)
  const activityThreshold = minutesToMillis(threshold)

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

    unwatch = watch(countdown, async () => {
      if (user.value) {
        // Refresh token when session will expire in less than 10 minutes
        const sessionExpiresIn10min = countdown.value < minutesToMillis(10)

        if (!sessionExpiresIn10min) {
          return
        }

        // And if user has been active in the last 10 minutes
        const inactivityCountdown = parseInt(
          localStorage.getItem(COUNTDOWN_INACTIVITY_LABEL) || '0'
        )
        const userHasActivity =
          activityThreshold - inactivityCountdown < minutesToMillis(10)

        if (!userHasActivity) {
          console.log('auth-management: user is not active')
          return
        }
        console.log(
          'auth-management: refresh token in handleSessionRefreshOnInterval'
        )
        await refreshToken()
      } else {
        console.log('auth-management: handleSessionRefreshOnInterval no user')
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
