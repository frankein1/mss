import { useAuthStore } from '~/store/auth'

export async function useUserFromCookie() {
  const authStore = useAuthStore()

  const { cookieKey } = useRuntimeConfig().public.auth
  const token = useCookie(cookieKey)

  if (!authStore.isAuthenticated && token.value) {
    const user = await useTrpcClient().auth.getUser.query()

    if (user) {
      authStore.login(user)
    }
  }
}
