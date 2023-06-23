import { useAuthStore } from '~/store/auth'
import { RoutePath } from '~/utils/routing/routes'
import { canViewStats } from '~/server/security/rules'

export default defineNuxtRouteMiddleware(() => {
  const { getAuthUser: user } = useAuthStore()
  if (!canViewStats(user)) {
    return navigateTo(RoutePath.Overview())
  }
})
