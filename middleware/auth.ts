import { useAuthStore } from '~/store/auth'
import { Routes } from '~/utils/routing/routes'

export default defineNuxtRouteMiddleware(to => {
  const { $pinia } = useNuxtApp()
  const authStore = useAuthStore($pinia)
  if (!authStore.isAuthenticated) {
    return navigateTo({
      path: Routes.Login,
      query: { redirectUrl: to.fullPath }
    })
  }
})
