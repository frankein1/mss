import { routes } from '~/utils/routes'
import { isDefaultRedirect } from '~/utils/isDefaultRedirect'

export default defineNuxtRouteMiddleware(to => {
  const authState = useAuthState()
  if (!authState.isAuthenticated()) {
    const redirectUrl = isDefaultRedirect(to.fullPath) ? undefined : to.fullPath
    return navigateTo({
      path: routes.auth.AuthLogin.path(),
      query: { redirectUrl }
    })
  }
  // POC tableau de bord décideur : les CGU actuelles décrivent le suivi de
  // dossiers bénéficiaires et le secret professionnel, ce qui ne correspond
  // pas à un usage de consultation de statistiques agrégées.
  // À remplacer par des CGU dédiées avant toute mise en production.
  if (authState.isDecisionMaker()) {
    return
  }

  const {
    public: { cguVersion }
  } = useRuntimeConfig()
  const { status, latestVersionAccepted } = authState.hasAcceptedCgu(cguVersion)
  if (!status) {
    const showSummary = latestVersionAccepted !== null
    if (authState.isStructureManager()) {
      return navigateTo(routes.cgu.CGUManager.path({ showSummary }))
    }
    return navigateTo(routes.cgu.CGUUser.path({ showSummary }))
  }
})
