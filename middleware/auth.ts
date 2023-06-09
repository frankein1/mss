import { useAuthStore } from '~/store/auth'
import { Routes } from '~/utils/routing/routes'

export default defineNuxtRouteMiddleware(to => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  if (!isAuthenticated) {
    return navigateTo({
      path: Routes.Login(),
      query: { redirectUrl: to.fullPath }
    })
  }
  if (!authStore.isActive) {
    return navigateTo(Routes.DisabledAccount())
  }
})
