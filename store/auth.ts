import { StructureType, UserRole } from '@prisma/client'
import { defineStore } from 'pinia'
import { JwtUser } from '~/types/user'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => {
    const user: JwtUser | null = null as any
    return {
      user
    }
  },
  actions: {
    setUser(user: JwtUser) {
      this.user = user
    }
  },
  getters: {
    isAuthenticated(): boolean {
      return !!this.user
    },
    isResponsableDeStructure(): boolean {
      return this.user?.role === UserRole.StructureManager
    },
    isTravailleurSocial(): boolean {
      return this.user?.role === UserRole.SocialWorker
    },
    isInstructeur(): boolean {
      return this.user?.role === UserRole.Instructor
    },
    isReferent(): boolean {
      return this.user?.role === UserRole.Referent
    },
    isAgentDAccueil(): boolean {
      return this.user?.role === UserRole.ReceptionAgent
    },
    userId(): string | null {
      return this.user ? this.user.id : null
    },
    userName(): string | null {
      return this.user ? `${this.user.firstName} ${this.user.lastName}` : 'null'
    },
    userOrganisationId(): string | null {
      return this.user
        ? this.user.structureId
          ? this.user.structureId
          : null
        : null
    },
    isMinistryAgent(): boolean {
      return this.user
        ? this.user.structureType === StructureType.Ministere
        : false
    },
    isAssociationAgent(): boolean {
      return this.user
        ? this.user.structureType === StructureType.Association
        : false
    }
  }
})
