import { RoutePath } from '~/utils/routing'

export default defineNuxtRouteMiddleware(to => {
  const authState = useAuthState()
  if (!authState.isAuthenticated()) {
    return navigateTo({
      path: RoutePath.AuthLogin(),
      query: { redirectUrl: to.fullPath }
    })
  }
  const {
    public: { cguVersion }
  } = useRuntimeConfig()
  if (!authState.hasAcceptedCgu(cguVersion)) {
    if (authState.isStructureManager()) {
      return navigateTo(RoutePath.CGUManager())
    }
    return navigateTo(RoutePath.CGUUser())
  }
})
