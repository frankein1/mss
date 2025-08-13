import { UserRole, UserStatus } from '@prisma/client'
import type { JwtUser } from '~/server/lib/jwt'
import { formatUserDisplayName } from '~/utils/user'

export function useAuthState() {
  const user = useState<JwtUser | undefined | null>(
    'auth:state',
    () => undefined
  )

  const role = computed(() => {
    return user.value ? user.value.role : null
  })

  const status = computed(() => {
    return user.value ? user.value.status : null
  })

  function getUserName() {
    return user.value ? formatUserDisplayName(user.value) : ''
  }

  const getUserId = computed(() => (user.value ? user.value.id : undefined))

  function isAuthenticated() {
    return !!user.value
  }
  function isReferent(): boolean {
    return role.value === UserRole.Referent
  }
  function isAdmin(): boolean {
    return role.value === UserRole.Administrator
  }
  function isStructureManager(): boolean {
    return role.value === UserRole.StructureManager
  }
  function isReceptionAgent(): boolean {
    return role.value === UserRole.ReceptionAgent
  }
  function isActive() {
    return status.value === UserStatus.Active
  }

  function hasAcceptedCgu(cguVersion: string) {
    if (!user.value) {
      return false
    }
    return user.value.CGUHistoryVersion === cguVersion
  }

  return {
    user,
    isAuthenticated,
    isReferent,
    isAdmin,
    isActive,
    isStructureManager,
    isReceptionAgent,
    getUserName,
    getUserId,
    hasAcceptedCgu
  }
}
