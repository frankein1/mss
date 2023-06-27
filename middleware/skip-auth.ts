import { useAuthStore } from '~/store/auth'
import { RoutePath } from '~/utils/routing/routes'

export default defineNuxtRouteMiddleware(to => {
  const authStore = useAuthStore()
  if (authStore.isAuthenticated) {
    const redirectUrl =
      (to.query.redirectUrl as string | undefined) || RoutePath.Overview()
    return navigateTo(redirectUrl)
  }
})
