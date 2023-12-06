import { StructureType, UserRole, UserStatus } from '@prisma/client'
import { defineStore } from 'pinia'
import { JwtUser } from '~/types/user'

const REFRESH_TOKEN_DELAY = 1000 * 60 * 20

type Timer = ReturnType<typeof setTimeout>

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as JwtUser | null,
    timer: null as Timer | null
  }),

  actions: {
    login(user: JwtUser) {
      this.user = user
      this.refreshToken()
    },
    logout() {
      this.user = null
    },
    refreshToken() {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(async () => {
        const res = await fetch('/api/auth/refresh-token', {
          method: 'POST'
        })
        if (res.ok) {
          this.refreshToken()
        }
      }, REFRESH_TOKEN_DELAY)
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
