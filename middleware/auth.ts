import { routes } from '~/routes'

export default defineNuxtRouteMiddleware(to => {
  const authState = useAuthState()

  const isAdminRoute = to.fullPath.startsWith(routes.admin.Admin.path())

  if (!authState.isAuthenticated()) {
    return navigateTo({
      path: isAdminRoute
        ? routes.auth.AuthAdmin.path()
        : routes.auth.AuthLogin.path(),
      query: { redirectUrl: to.fullPath }
    })
  }

  if (!authState.isActive()) {
    return navigateTo(routes.error.ErrorDisabledAccount.path())
  }
  if (
    (isAdminRoute && !authState.isAdmin()) ||
    (!isAdminRoute && authState.isAdmin())
  ) {
    return navigateTo(useHomePage())
  }
})
