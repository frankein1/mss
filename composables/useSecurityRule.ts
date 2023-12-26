import { StructureType } from '@prisma/client'
import { useAuthState } from './useAuthState'
import { SecurityRuleGrantee } from '~/server/security'
export function useSecurityRule() {
  const state = useAuthState()

  const can = (actionRule: (grantee: SecurityRuleGrantee) => boolean) => {
    if (!state.user.value) {
      return false
    }
    return actionRule(state.user.value)
  }

  const canWithTarget = <T>(
    actionRule: (grantee: SecurityRuleGrantee, target: T) => boolean,
    target: T
  ) => {
    if (!state.user.value) {
      return false
    }
    return actionRule(state.user.value, target)
  }

  const canWithStructureType = (
    actionRule: (type: StructureType) => boolean
  ) => {
    if (!state.user.value?.structureType) {
      return false
    }
    return actionRule(state.user.value.structureType)
  }

  return { can, canWithTarget, canWithStructureType }
}
