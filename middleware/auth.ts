import { useAuthStore } from '~/store/auth'
import { RoutePath } from '~/utils/routing'

export default defineNuxtRouteMiddleware(async to => {
  const authStore = useAuthStore()

  await useLogUserFromCookie()

  const isAuthenticated = authStore.isAuthenticated
  const isAdminRoute = to.fullPath.startsWith(RoutePath.Admin())

  if (!isAuthenticated) {
    return navigateTo({
      path: isAdminRoute ? RoutePath.AuthAdmin() : RoutePath.AuthLogin(),
      query: { redirectUrl: to.fullPath }
    })
  }
  if (!authStore.isActive) {
    return navigateTo(RoutePath.ErrorDisabledAccount())
  }
  if (
    (isAdminRoute && !authStore.isAdmin) ||
    (!isAdminRoute && authStore.isAdmin)
  ) {
    return navigateTo(useHomePage())
  }
})
