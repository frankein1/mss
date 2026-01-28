export default defineNuxtRouteMiddleware(to => {
  const authState = useAuthState()
  if (authState.isAuthenticated()) {
    const redirectUrl =
      (to.query.redirectUrl as string | undefined) || useHomePage()
    // Nuxt navigation only authorizes relative urls
    return navigateTo(redirectUrl)
  }
})
