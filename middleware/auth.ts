import { useAuthStore } from '~/store/auth'
import { Routes } from '~/utils/routing/routes'

export default defineNuxtRouteMiddleware(to => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  if (!isAuthenticated) {
    return navigateTo({
      path: Routes.Login(),
      query: { redirectUrl: to.fullPath } // FIXME: Hash containing the wanted tab is unknown on the server side (here in the middleware!), so it is not in the fullPath
    })
  }
})
