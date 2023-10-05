import { useAuthStore } from '~/store/auth'

export async function useLogUserFromCookie() {
  const authStore = useAuthStore()

  const sessionCookieKey = useRuntimeConfig().public.sessionCookieKey
  const token = useCookie(sessionCookieKey)

  if (!authStore.isAuthenticated && token.value) {
    const user = await useTrpcClient().auth.getUser.query({})

    if (user) {
      authStore.login(user)
    }
  }
}
