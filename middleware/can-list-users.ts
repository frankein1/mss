import { useAuthStore } from '~/store/auth'
import { RoutePath } from '~/utils/routing/routes'
import { canListUsers } from '~/server/security'

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated || !canListUsers(authStore.getAuthUser)) {
    return navigateTo(RoutePath.AppOverview())
  }
})
