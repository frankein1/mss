import { useAuthState } from './useAuthState'
import type { AppContextPermissions } from '~/server/security'
import type { JwtUser } from '~/server/lib/jwt'

interface UserSession {
  user: JwtUser
  permissions: AppContextPermissions
}

export function useAuth() {
  const state = useAuthState()
  const { application, reset } = usePermissions()

  function logout() {
    state.user.value = null
    reset()
  }

  async function verifySession() {
    let session: UserSession | null = null

    try {
      session = await $fetch<UserSession>('/api/auth/verify-session')
    } catch (e: unknown) {
      logout()
      console.error(e)
      throw e
    }

    if (session) {
      state.user.value = session.user
      application.value = session.permissions
    } else {
      logout()
    }
  }

  /** Fetch a new auth token after having verified the current one */
  function refreshToken() {
    return $fetch<JwtUser>('/api/auth/refresh-token')
  }

  async function getSession() {
    const session = await $fetch<{
      user: JwtUser
      permissions: AppContextPermissions
    }>('/api/auth/get-session')
    if (session) {
      state.user.value = session.user
      application.value = session.permissions
    }
  }

  return { logout, refreshToken, getSession, verifySession }
}
