import { isSafeRedirectUrl } from '~/utils/isSafeRedirectUrl'

export default defineNuxtRouteMiddleware(to => {
  const authState = useAuthState()
  if (authState.isAuthenticated()) {
    const rawRedirect = to.query.redirectUrl as string | undefined
    const redirectUrl =
      rawRedirect && isSafeRedirectUrl(rawRedirect)
        ? rawRedirect
        : useHomePage()
    return navigateTo(redirectUrl)
  }
})
