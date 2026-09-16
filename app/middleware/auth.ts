import { routes } from '~/utils/routes'
import { isDefaultRedirect } from '~/utils/isDefaultRedirect'

export default defineNuxtRouteMiddleware(to => {
  const authState = useAuthState()

  const isAdminRoute = to.fullPath.startsWith(routes.admin.Admin.path())
  const isDecisionMakerRoute = to.fullPath.startsWith(
    routes.decisionMaker.AppDecisionMaker.path()
  )

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
  // Un décideur ne dispose que de son espace, et lui seul y accède.
  //
  // Les pages transverses en sont exclues : les CGU, notamment, sont imposées
  // par le middleware cgu à tout utilisateur qui ne les a pas acceptées.
  // Sans cette exception, les deux middlewares se renvoient la page
  // indéfiniment et le rendu serveur ne répond jamais.
  if (isDecisionMakerRoute && !authState.isDecisionMaker()) {
    return navigateTo(useHomePage())
  }
  if (
    !isDecisionMakerRoute &&
    !isCrossCuttingRoute(to.fullPath) &&
    authState.isDecisionMaker()
  ) {
    return navigateTo(useHomePage())
  }
})

/** Pages accessibles quel que soit l'espace : CGU, mentions légales, aide */
function isCrossCuttingRoute(path: string) {
  return (
    path.startsWith(routes.cgu.CGUUser.path()) ||
    path.startsWith(routes.cgu.CGUManager.path()) ||
    path.startsWith(routes.siteMap.path())
  )
}
