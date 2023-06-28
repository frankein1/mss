import { useAuthStore } from '~/store/auth'
import { RoutePath } from '~/utils/routing'

export default defineNuxtRouteMiddleware(async to => {
  const authStore = useAuthStore()

  const sessionCookieKey = useRuntimeConfig().public.sessionCookieKey
  const token = useCookie(sessionCookieKey)
  if (!authStore.isAuthenticated && token.value) {
    const user = await useTrpcClient().auth.getUser.query()

    if (user) {
      authStore.login(user)
    }
  }

  const isAuthenticated = authStore.isAuthenticated
  if (!isAuthenticated) {
    const admin = to.fullPath.startsWith(RoutePath.Admin())
    return navigateTo({
      path: admin ? RoutePath.LoginAdmin() : RoutePath.Login(),
      query: { redirectUrl: to.fullPath }
    })
  }
  if (!authStore.isActive) {
    return navigateTo(RoutePath.DisabledAccount())
  }
})
