import { UserRole } from '@prisma/client'
import { useAuthStore } from '~/store/auth'
import { RoutePath } from '~/utils/routing'

export default defineNuxtRouteMiddleware(to => {
  const { $pinia } = useNuxtApp()
  const authStore = useAuthStore($pinia)
  const user = authStore.user
  if (!user) {
    return navigateTo({
      path: RoutePath.AuthLogin(),
      query: { redirectUrl: to.fullPath }
    })
  }
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
