import { useAuthStore } from '~/store/auth'
import { RoutePath } from '~/utils/routing'

export default defineNuxtRouteMiddleware(to => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  if (!isAuthenticated) {
    return navigateTo({
      path: RoutePath.Login(),
      query: { redirectUrl: to.fullPath }
    })
  }
  if (!authStore.isActive) {
    return navigateTo(RoutePath.DisabledAccount())
  }
})
