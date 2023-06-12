import { onMounted, onUnmounted } from 'vue'
import { RoutePath } from '~/utils/routing'

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
      fetch(RoutePath.Logout()).then(() => {
        navigateTo(RoutePath.LogoutSuccess() + '?inactive=true')
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
