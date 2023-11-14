import { useAuthStore } from '~/store/auth'
import { JwtUser } from '~/types/user'
import { RoutePath } from '~/utils/routing'

export function useAuthUser(): ComputedRef<JwtUser> {
  const authStore = useAuthStore()

  const user = computed<JwtUser>(() => {
    const user = authStore.user

    if (!user) {
      navigateTo(RoutePath.AuthLogout())

      // Return a dumb but valid user
      return {} as JwtUser
    }
    return user
  })

  return user
}
