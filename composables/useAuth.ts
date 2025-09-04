import { useAuthState } from './useAuthState'
import type { AppContextPermissions } from '~/server/security'
import type { JwtUser } from '~/server/lib/jwt'
import { minutesToMillis } from '~/utils/time'
import { COUNTDOWN_SESSION_LABEL } from '~/utils/constants'

interface UserSession {
  user: JwtUser
  permissions: AppContextPermissions
}

function resetSessionTimer() {
  const {
    public: {
      auth: { tokenValidationInMinutes }
    }
  } = useRuntimeConfig()
  const initial = minutesToMillis(tokenValidationInMinutes)
  localStorage.setItem(COUNTDOWN_SESSION_LABEL, initial.toString())
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
    const headers = useRequestHeaders(['cookie'])

    try {
      session = await $fetch<UserSession>('/api/auth/verify-session', {
        headers
      })
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

  /** Fetch a new auth token after having verified the current one and reset the local timer for session renewal */
  async function refreshToken() {
    const session = await $fetch<JwtUser>('/api/auth/refresh-token')
    resetSessionTimer()
    return session
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

  return { logout, refreshToken, getSession, verifySession }
}
