import { useAuthState } from './useAuthState'
import type { AppContextPermissions } from '~/server/security'
import type { JwtUser } from '~/server/lib/jwt'
import type { UserAuthenticatedInfo } from '~/types/auth'

export function useAuth() {
  const state = useAuthState()
  const { application, reset } = usePermissions()

  function logout() {
    state.user.value = null
    reset()
  }

  /** Fetch a new auth token after having verified the current one */
  function refreshToken() {
    return $fetch<JwtUser>('/api/auth/refresh-token')
  }

  async function getSession() {
    const headers = useRequestHeaders(['cookie'])
    const session = await $fetch<{
      user: UserAuthenticatedInfo
      permissions: AppContextPermissions
    }>('/api/auth/get-session', {
      headers
    })
    if (session) {
      state.user.value = session.user
      application.value = session.permissions
    }
  }

  return { logout, refreshToken, getSession }
}
