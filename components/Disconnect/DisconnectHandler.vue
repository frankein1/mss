<script setup lang="ts">
  // Inactivity management:
  // - Store in local storage an inactivity countdown
  // - Display a disconnect modal when the user has been inactive for some time

  import DisconnectAlert from './DisconnectAlert.vue'
  import { apiRoutes } from '~/utils/routes'
  import { minutesToMillis } from '~/utils/time'
  import {
    promiseTimeout,
    useEventListener,
    useLocalStorage
  } from '@vueuse/core'
  import {
    COUNTDOWN_INACTIVITY_LABEL,
    DEFAULT_INTERVAL_TIME_FOR_STORAGE_REFRESH
  } from '~/utils/constants'

  const {
    public: {
      disconnect: { alertThreshold, threshold }
    }
  } = useRuntimeConfig()

  const { user } = useAuthState()
  const { refreshToken } = useAuth()
  const modal = useModal()

  const intervalTimeInMs = DEFAULT_INTERVAL_TIME_FOR_STORAGE_REFRESH
  const initial = minutesToMillis(threshold)
  const alert = minutesToMillis(alertThreshold)

  // The inactivity counter is stored in local storage in order to manage several tabs
  const countdown = useLocalStorage(COUNTDOWN_INACTIVITY_LABEL, initial)
  resetInactivityTimer()

  // Every mouse activity resets the inactivity counter
  const cleanupListener = useEventListener('mousemove', resetInactivityTimer)
  const cleanupKeydownListener = useEventListener(
    'keydown',
    resetInactivityTimer
  )

  // Every intervalTimeInMs the counter is decremented
  const timer = setInterval(() => {
    countdown.value = countdown.value - intervalTimeInMs
  }, intervalTimeInMs)

  const unwatch = watch(countdown, async () => {
    if (user.value) {
      // If the user is inactive for more than threshold she is logged out
      if (countdown.value < 0) {
        cleanup()
        logout()
      }
      // Show a warning disconnect modal X minutes before the disconnect limit
      else if (countdown.value < alert) {
        await openDisconnectAlert()
      }
    } else {
      console.log('disconnect-handler: handleInactivityOnInterval no user')
      cleanup()
    }
  })

  function logout() {
    if (import.meta.client) {
      navigateTo(apiRoutes.proConnect.ApiLogout.path() + '?inactive=true', {
        external: true
      })
    }
  }

  async function openDisconnectAlert() {
    if (!modal.isReady.value) {
      throw new Error('disconnect-handler: modal not ready')
    }

    // If another modal is already opened, close it to reopen Disconnect alert
    if (modal.isOpen.value && !modal.title.value.match(/déconnexion dans/i)) {
      modal.close()

      // Wait for the modal state component to be reset (cf. useModal.ts#close)
      // when refactoring the modal, we could handle internally the unmount of internal component
      // and not destroy it with a `v-if="isOpen"` like currently done in AtomModal
      await promiseTimeout(1000)
    }

    modal.open(DisconnectAlert, {
      triggerOpen: true,
      title: `Déconnexion dans ${alertThreshold} minutes`,
      disconnect: () =>
        navigateTo(apiRoutes.proConnect.ApiLogout.path(), { external: true }),
      keepConnect: () => {
        if (countdown.value < 0) {
          cleanup()
          logout()
        } else {
          refreshToken()
        }
      }
    })
  }

  function cleanup() {
    console.debug('disconnect-handler: cleanup')

    if (unwatch) {
      unwatch()
    }
    if (timer) {
      clearInterval(timer)
    }
    if (cleanupListener) {
      cleanupListener()
    }
    if (cleanupKeydownListener) {
      cleanupKeydownListener()
    }
    countdown.value = undefined
    localStorage.removeItem(COUNTDOWN_INACTIVITY_LABEL)
  }

  function resetInactivityTimer() {
    countdown.value = initial
  }
</script>
