import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware(async to => {
  /**
   * // FIXME: Skip auth middleware only works on server-side as the token cookie
   * is HTTP only. After a navigation from another page to the login page, the
   * middleware is run on the client-side and as the cookie is not available,
   * the login page is not skipped.
   */
  await useLogUserFromCookie()

  const authStore = useAuthStore()
  if (authStore.isAuthenticated) {
    const redirectUrl =
      (to.query.redirectUrl as string | undefined) || useHomePage()
    return navigateTo(redirectUrl)
  }
})
