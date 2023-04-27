import { useAuthStore } from '~/store/auth'

export function useMinistryAgent() {
  const { $pinia } = useNuxtApp()
  const authStore = useAuthStore($pinia)

  const isMinistryAgent = computed(() => authStore.isMinistryAgent)

  return isMinistryAgent
}
