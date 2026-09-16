import { useAuthState } from './useAuthState'
import { routes } from '~/utils/routes'

export function useHomePage() {
  const authState = useAuthState()
  if (authState.isAdmin()) {
    return routes.admin.AdminOverview.path()
  }
  if (authState.isDecisionMaker()) {
    return routes.decisionMaker.AppDecisionMakerStatisticsBeneficiaries.path()
  }

  return routes.user.AppOverview.path()
}
