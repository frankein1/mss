export default defineNuxtRouteMiddleware(to => {
  const authState = useAuthState()
  if (authState.isAuthenticated()) {
    const redirectUrl =
      (to.query.redirectUrl as string | undefined) || useHomePage()
    return navigateTo(redirectUrl)
  }
})
