import { useAuthState } from './useAuthState'
import { JwtUser } from '~/types/user'

export function useAuth() {
  const state = useAuthState()

  function login(user: JwtUser) {
    state.user.value = user
  }
  function logout() {
    state.user.value = null
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
