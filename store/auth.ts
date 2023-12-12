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
    login(user: JwtUser) {
      this.user = user
      this.startRefreshToken()
    },
    logout() {
      this.user = null
      this.stopRefreshToken()
    },
    stopRefreshToken() {
      if (this.timer) {
        clearTimeout(this.timer)
      }
    },
    startRefreshToken() {
      const {
        public: {
          auth: { tokenValidationInMinutes }
        }
      } = useRuntimeConfig()
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(
        async () => {
          const res = await fetch('/api/auth/refresh-token', {
            method: 'POST'
          })
          if (res.ok) {
            this.startRefreshToken()
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
  },
  persist: true
})
