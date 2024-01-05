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
    const sessionUser = await $fetch<JwtUser>('/api/auth/get-session', {
      headers
    })
    if (sessionUser) {
      state.user.value = sessionUser
    }
  }

  return { login, logout, refreshToken, getSession }
}
