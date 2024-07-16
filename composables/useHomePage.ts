import { useAuthState } from './useAuthState'
import { routes } from '~/routes'

export function useHomePage() {
  const admin = useAuthState().isAdmin()
  if (admin) {
    return routes.admin.AdminOverview.path()
  }

  return routes.user.AppOverview.path()
}
