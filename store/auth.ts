import { StructureType, UserRole, UserStatus } from '@prisma/client'
import { defineStore } from 'pinia'
import { JwtUser } from '~/types/user'
import { minutesToMillis } from '~/utils/time'

type Timer = ReturnType<typeof setTimeout>

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as JwtUser | null,
    timer: null as Timer | null
  }),

  actions: {
    init(user: JwtUser, tokenValidationInMinutes: number) {
      this.login(user)
      this.startRefreshToken(tokenValidationInMinutes)
    },
    login(user: JwtUser) {
      this.user = user
    },
    logout() {
      this.user = null
    },
    stopRefreshToken() {
      if (this.timer) {
        clearTimeout(this.timer)
      }
    },
    startRefreshToken(tokenValidationInMinutes: number) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(
        async () => {
          const user = await $fetch<JwtUser>('/api/auth/refresh-token')
          if (user) {
            this.startRefreshToken(tokenValidationInMinutes)
          }
        },
        minutesToMillis(tokenValidationInMinutes) / 2
      )
    }
  },

  getters: {
    isAuthenticated(): boolean {
      return !!this.user
    },
    isReferent(): boolean {
      return this.user?.role === UserRole.Referent
    },
    userId(): string {
      return this.user?.id || ''
    },
    userStructureType(): StructureType | undefined {
      return this.user?.structureType || undefined
    },
    isAdmin(): boolean {
      return this.user?.role === UserRole.Administrator
    },
    isActive(): boolean {
      return this.user?.status === UserStatus.Active
    }
  }
})
