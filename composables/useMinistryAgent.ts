import { StructureType } from '@prisma/client'
import { useAuthStore } from '~/store/auth'

export function useMinistryAgent() {
  const { $pinia } = useNuxtApp()
  const authStore = useAuthStore($pinia)

  const isMinistryAgent = computed(
    () => authStore.userStructureType === StructureType.Ministere
  )

  return isMinistryAgent
}
