import { RoutePath } from '~/utils/routing'

export default defineNuxtRouteMiddleware(to => {
  const authState = useAuthState()

  const isAdminRoute = to.fullPath.startsWith(RoutePath.Admin())

  if (!authState.isAuthenticated()) {
    return navigateTo({
      path: isAdminRoute ? RoutePath.AuthAdmin() : RoutePath.AuthLogin(),
      query: { redirectUrl: to.fullPath }
    })
  }

  if (!authState.isActive()) {
    return navigateTo(RoutePath.ErrorDisabledAccount())
  }
  if (
    (isAdminRoute && !authState.isAdmin()) ||
    (!isAdminRoute && authState.isAdmin())
  ) {
    return navigateTo(useHomePage())
  }
})
