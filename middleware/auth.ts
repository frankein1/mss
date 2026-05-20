import { routes } from '~/utils/routes'
import { isDefaultRedirect } from '~/utils/isDefaultRedirect'

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
    const redirectUrl = isDefaultRedirect(to.fullPath) ? undefined : to.fullPath
    return navigateTo({
      path: routes.auth.AuthLogin.path(),
      query: { redirectUrl }
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
