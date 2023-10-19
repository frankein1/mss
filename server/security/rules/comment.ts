import type {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityTargetWithReferents
} from './types'
import { canViewBeneficiary } from './beneficiary'

export const canAddComment = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean => canViewBeneficiary(grantee, beneficiary)

export const canListComments = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean => canViewBeneficiary(grantee, beneficiary)
