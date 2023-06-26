import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware(to => {
  const authStore = useAuthStore()
  if (authStore.isAuthenticated) {
    const redirectUrl =
      (to.query.redirectUrl as string | undefined) || useHomePage()
    return navigateTo(redirectUrl)
  }
})
