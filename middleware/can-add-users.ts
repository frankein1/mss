import { useAuthStore } from '~/store/auth'
import { Routes } from '~/utils/routing/routes'
import { canListUsers } from '~/server/security/rules'

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated || !canListUsers(authStore.getAuthUser)) {
    return navigateTo(Routes.Overview())
  }
})
