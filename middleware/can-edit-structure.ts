import { useAuthStore } from '~/store/auth'
import { RoutePath } from '~/utils/routing/routes'
import { canEditStructure } from '~/server/security/rules'

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  const user = authStore.getAuthUser
  if (
    !authStore.isAuthenticated ||
    !canEditStructure(user, { structureId: user.structureId })
  ) {
    return navigateTo(RoutePath.Overview())
  }
})
