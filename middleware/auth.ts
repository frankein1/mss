import { routes } from '~/utils/routes'

export default defineNuxtRouteMiddleware(to => {
  const authState = useAuthState()

  const isAdminRoute = to.fullPath.startsWith(routes.admin.Admin.path())

  if (import.meta.client) {
    const { $sentry } = useNuxtApp()
    const user = authState.user.value?.id
      ? { id: authState.user.value.id }
      : null
    $sentry?.setUser(user)
  }

  if (!authState.isAuthenticated()) {
    return navigateTo({
      path: routes.auth.AuthLogin.path(),
      query: { redirectUrl: to.fullPath }
    })
  }

  if (!authState.isActive()) {
    throw createError({
      statusCode: 403,
      message: 'deactivated user'
    })
  }
  if (
    (isAdminRoute && !authState.isAdmin()) ||
    (!isAdminRoute && authState.isAdmin())
  ) {
    return navigateTo(useHomePage())
  }
})
