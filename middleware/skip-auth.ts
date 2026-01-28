export default defineNuxtRouteMiddleware(to => {
  const authState = useAuthState()
  const {
    public: { appUrl }
  } = useRuntimeConfig()
  if (authState.isAuthenticated()) {
    const hasRedirect = !!to.query.redirectUrl
    const redirectUrl =
      (hasRedirect
        ? `${appUrl}${to.query.redirectUrl as string | undefined}`
        : undefined) || useHomePage()
    return navigateTo(redirectUrl)
  }
})
