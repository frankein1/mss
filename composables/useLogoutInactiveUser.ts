import { onMounted, onUnmounted } from 'vue'
import { RoutePath } from '~/utils/routing'

type Interval = ReturnType<typeof setInterval>
type Timeout = ReturnType<typeof setTimeout>

export function useLogoutInactiveUser() {
  const {
    public: { inactiveUserTimeThreshold }
  } = useRuntimeConfig()

  const INACTIVE_USER_TIME_THRESHOLD = inactiveUserTimeThreshold * 60 * 1000

  const counter = ref(INACTIVE_USER_TIME_THRESHOLD)

  let interval: Interval | null
  let timeout: Timeout | null

  function stop() {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  function startTimeout() {
    stop()
    counter.value = INACTIVE_USER_TIME_THRESHOLD
    interval = setInterval(() => {
      counter.value = counter.value - 1000
    }, 1000)
    timeout = setTimeout(() => {
      logout()
    }, INACTIVE_USER_TIME_THRESHOLD)
  }

  function logout() {
    if (process.client) {
      navigateTo(RoutePath.AuthLogout() + '?inactive=true')
    }
  }

  onMounted(() => window.addEventListener('mousemove', startTimeout))
  onUnmounted(() => {
    window.removeEventListener('mousemove', startTimeout)
    stop()
  })

  return { counter }
}
