import { useAuthStore } from '~/store/auth'
import { RoutePath } from '~/utils/routing/routes'
import { canEditItsOwnStructure } from '~/server/security'

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  const user = authStore.getAuthUser
  if (!authStore.isAuthenticated || !canEditItsOwnStructure(user)) {
    return navigateTo(RoutePath.AppOverview())
  }
})
