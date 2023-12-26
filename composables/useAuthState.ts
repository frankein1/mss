import { StructureType, UserRole, UserStatus } from '@prisma/client'
import { JwtUser } from '~/types/user'

export function useAuthState() {
  const user = useState<JwtUser>('auth:state')

  function isAuthenticated() {
    return !!user
  }
  function isReferent(): boolean {
    return user.value.role === UserRole.Referent
  }
  function isAdmin(): boolean {
    return user.value.role === UserRole.Administrator
  }
  function isStructureManager(): boolean {
    return user.value.role === UserRole.StructureManager
  }
  function isActive() {
    return user.value.status === UserStatus.Active
  }

  function isMinistryAgent() {
    return user.value.structureType === StructureType.Ministere
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
    isMinistryAgent,
    isStructureManager,
    hasAcceptedCgu
  }
}
