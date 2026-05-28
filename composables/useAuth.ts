import { useAuthState } from './useAuthState'
import type { UserProfile } from './useAuthState'
import type { AppContextPermissions } from '~/server/security'

export function useAuth() {
  const state = useAuthState()
  const { application, reset } = usePermissions()

  function logout() {
    state.user.value = null
    reset()
  }

  function refreshToken() {
    return $fetch('/api/auth/refresh-token')
  }

  async function getSession() {
    const headers = useRequestHeaders(['cookie'])
    const session = await $fetch<{
      user: UserProfile
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
