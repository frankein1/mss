import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware(to => {
  const { $pinia } = useNuxtApp()

  const authStore = useAuthStore($pinia)
  if (authStore.isAuthenticated) {
    const redirectUrl =
      (to.query.redirectUrl as string | undefined) || useHomePage()
    return navigateTo(redirectUrl)
  }
})
