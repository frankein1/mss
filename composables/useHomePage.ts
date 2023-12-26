import { useAuthState } from './useAuthState'
import { RoutePath } from '~/utils/routing'

export function useHomePage() {
  const admin = useAuthState().isAdmin()
  if (admin) {
    return RoutePath.AdminOverview()
  }

  return RoutePath.AppOverview()
}
