import { useAuthState } from './useAuthState'
import { AppContextPermissions } from '~/server/security'
import { JwtUser } from '~/types/user'

export function useAuth() {
  const state = useAuthState()
  const { application, reset } = usePermissions()

  function login(params: {
    user: JwtUser
    permissions: AppContextPermissions
  }) {
    state.user.value = params.user
    application.value = params.permissions
  }
  function logout() {
    state.user.value = null
    reset()
  }

  function refreshToken() {
    return $fetch<JwtUser>('/api/auth/refresh-token')
  }

  async function getSession() {
    const headers = useRequestHeaders(['cookie'])
    const session = await $fetch<{
      user: JwtUser
      permissions: AppContextPermissions
    }>('/api/auth/get-session', {
      headers
    })
    if (session) {
      state.user.value = session.user
      application.value = session.permissions
    }
  }

  return { login, logout, refreshToken, getSession }
}
