import { StructureType, UserRole, UserStatus } from '@prisma/client'
import { defineStore } from 'pinia'
import { JwtUser } from '~/types/user'

export const useAuthStore = defineStore({
  id: 'auth',

  state: () => ({
    user: null as JwtUser | null
  }),

  actions: {
    login(user: JwtUser) {
      this.user = user
    },
    logout() {
      this.user = null
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
    getAuthUser(): JwtUser {
      if (!this.user) {
        throw new Error('No auth user in store!')
      }
      return this.user
    },
    userId(): string {
      return this.user?.id || ''
    },
    userName(): string {
      return this.user ? `${this.user.firstName} ${this.user.lastName}` : ''
    },
    userStructureId(): string {
      return this.user?.structureId || ''
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
    },
    isActive(): boolean {
      return this.user?.status === UserStatus.Active
    }
  }
})
