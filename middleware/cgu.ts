import { UserRole } from '@prisma/client'
import { useAuthStore } from '~/store/auth'
import { RoutePath } from '~/utils/routing'

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  const user = authStore.getAuthUser
  const {
    public: { cguVersion }
  } = useRuntimeConfig()
  if (user.CGUHistoryVersion !== cguVersion) {
    if (user.role === UserRole.StructureManager) {
      return navigateTo(RoutePath.CGUManager())
    }
    return navigateTo(RoutePath.CGUUser())
  }
})
