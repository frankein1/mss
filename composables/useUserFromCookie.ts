import { useAuthStore } from '~/store/auth'

export async function useUserFromCookie() {
  const authStore = useAuthStore()

  const { cookieKey, tokenValidationInMinutes } = useRuntimeConfig().public.auth
  const token = useCookie(cookieKey)

  if (!authStore.isAuthenticated && token.value) {
    const user = await useTrpcClient().auth.getUser.query()

    if (user) {
      authStore.init(user, tokenValidationInMinutes)
    }
  }
}
