import { useAuthStore } from '~/store/auth'
import { JwtUser } from '~/types/user'

export function useAuthUser(): ComputedRef<JwtUser> {
  const authStore = useAuthStore()

  const user = computed<JwtUser>(() => {
    const user = authStore.user

    if (!user) {
      throw createError('No User found in the store')
    }
    return user
  })

  return user
}
