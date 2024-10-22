import { useStorage } from '@vueuse/core'

export type AuthProvider = 'proconnect' | 'inclusionconnect' | 'admin'

export function useAuthProvider() {
  const provider = useStorage<AuthProvider | undefined>(
    'auth-provider',
    undefined
  )

  function reset() {
    provider.value = undefined
  }

  const isProConnect = computed(() => provider.value === 'proconnect')

  return { provider, isProConnect, reset }
}
