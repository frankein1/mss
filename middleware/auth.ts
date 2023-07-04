import { useAuthStore } from '~/store/auth'
import { RoutePath } from '~/utils/routing'

export default defineNuxtRouteMiddleware(async to => {
  const authStore = useAuthStore()

  await useLogUserFromCookie()

  const isAuthenticated = authStore.isAuthenticated
  if (!isAuthenticated) {
    const admin = to.fullPath.startsWith(RoutePath.Admin())
    return navigateTo({
      path: admin ? RoutePath.AuthAdmin() : RoutePath.AuthLogin(),
      query: { redirectUrl: to.fullPath }
    })
  }
  if (!authStore.isActive) {
    return navigateTo(RoutePath.ErrorDisabledAccount())
  }
})
