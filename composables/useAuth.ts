import { useAuthStore } from '~/store/auth'
import { JwtUser } from '~/types/user'

export function useAuth() {
  const authStore = useAuthStore()

  const refreshToken = () => {
    return $fetch<JwtUser>('/api/auth/refresh-token')
  }

  const getSession = async () => {
    const user = await $fetch<JwtUser>('/api/auth/get-session')
    if (user) {
      authStore.login(user)
    }
  }

  const user = computed<JwtUser>(() => {
    const user = authStore.user

    if (!user) {
      throw createError('No User found in the store')
    }
    return user
  })

  return { refreshToken, getSession, user }
}
