import { useAuthStore } from '~/store/auth'
import { RoutePath } from '~/utils/routing'

export function useHomePage() {
  const admin = useAuthStore().isAdmin
  if (admin) {
    return RoutePath.AdminStructures()
  }

  return RoutePath.AppOverview()
}
