import { StructureType, UserRole } from '@prisma/client'
import { defineStore } from 'pinia'
import { useAuthUser } from '~/composables/useAuthUser'

export const useAuthStore = defineStore('auth', () => {
  const user = useAuthUser()

  const isAuthenticated = computed(() => {
    return !!user
  })
  const isResponsableDeStructure = computed(
    () => user?.role === UserRole.StructureManager
  )
  const isTravailleurSocial = computed(
    () => user?.role === UserRole.SocialWorker
  )
  const isInstructeur = computed(() => user?.role === UserRole.Instructor)
  const isReferent = computed(() => user?.role === UserRole.Referent)
  const isAgentDAccueil = computed(() => user?.role === UserRole.ReceptionAgent)
  const userId = computed(() => user?.id)
  const userName = computed(() =>
    user ? `${user?.firstName} ${user?.lastName}` : ''
  )
  const userOrganisationId = computed(() => user?.structureId)
  const isMinistryAgent = computed(
    () => user?.structureType === StructureType.Ministere
  )
  const isAssociationAgent = computed(
    () => user?.structureType === StructureType.Association
  )

  return {
    isAuthenticated,
    isResponsableDeStructure,
    isTravailleurSocial,
    isInstructeur,
    isReferent,
    isAgentDAccueil,
    userId,
    userName,
    userOrganisationId,
    isMinistryAgent,
    isAssociationAgent
  }
})
