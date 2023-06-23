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
    isReferent(): boolean {
      return this.user?.role === UserRole.Referent
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
    userStructureType(): StructureType | undefined {
      return this.user?.structureType
    },
    isActive(): boolean {
      return this.user?.status === UserStatus.Active
    }
  }
})
