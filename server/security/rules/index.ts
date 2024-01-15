import type {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityTargetWithReferents,
  SecurityRule,
  SecurityRuleContext,
  SecurityTargetWithCreator
} from './types'
import {
  hasAllowedRole,
  isReferent,
  isCreator,
  isInSameStructureAs
} from './helpers'
export { hasAllowedRole, isReferent, isCreator, isInSameStructureAs }

export type {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityRuleContext,
  SecurityTargetWithReferents,
  SecurityRule,
  SecurityTargetWithCreator
}

export { canEditUser, canEditUserRole } from './user'
