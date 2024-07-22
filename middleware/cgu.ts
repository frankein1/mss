import { routes } from '~/utils/routes'

export default defineNuxtRouteMiddleware(to => {
  const authState = useAuthState()
  if (!authState.isAuthenticated()) {
    return navigateTo({
      path: routes.auth.AuthLogin.path(),
      query: { redirectUrl: to.fullPath }
    })
  }
  const {
    public: { cguVersion }
  } = useRuntimeConfig()
  if (!authState.hasAcceptedCgu(cguVersion)) {
    if (authState.isStructureManager()) {
      return navigateTo(routes.cgu.CGUManager.path())
    }
    return navigateTo(routes.cgu.CGUUser.path())
  }
})
