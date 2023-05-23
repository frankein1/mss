import { onMounted, onUnmounted } from 'vue'
import { Routes } from '~/utils/routing/routes'

export function useLogoutInactiveUser() {
  const {
    public: { inactiveUserTimeThreshold }
  } = useRuntimeConfig()

  const INACTIVE_USER_TIME_THRESHOLD = inactiveUserTimeThreshold * 60 * 1000

  let userActivityTimeout = startTimeout()

  function resetUserActivityTimeout() {
    clearTimeout(userActivityTimeout)
    userActivityTimeout = startTimeout()
  }

  function startTimeout() {
    return setTimeout(() => {
      inactiveUserAction()
    }, INACTIVE_USER_TIME_THRESHOLD)
  }

  function inactiveUserAction() {
    if (process.client) {
      fetch(Routes.Logout()).then(() => {
        navigateTo(Routes.LogoutSuccess() + '?inactive=true')
      })
    }
  }

  onMounted(() =>
    window.addEventListener('mousemove', resetUserActivityTimeout)
  )
  onUnmounted(() => {
    window.removeEventListener('mousemove', resetUserActivityTimeout)
    clearTimeout(userActivityTimeout)
  })

  return { userActivityTimeout }
}
