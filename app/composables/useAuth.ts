import { useAuthState } from './useAuthState'

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
    const session = await $fetch('/api/auth/get-session', {
      headers
    })
    if (session) {
      state.user.value = session.user
      application.value = session.permissions
    }
  }

  function setCGUVersion(version: string) {
    if (!state.user.value) {
      return
    }
    state.user.value.CGUHistoryVersion = version
  }

  return { logout, refreshToken, getSession, setCGUVersion }
}
