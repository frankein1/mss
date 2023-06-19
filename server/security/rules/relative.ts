import type {
  SecurityRuleGrantee,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure
} from './types'
import { hasNotDisallowedRole } from './helpers'
import { canViewBeneficiary } from './beneficiary'

export const canListBeneficiaryRelatives = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  canViewBeneficiary(grantee, beneficiary) &&
  hasNotDisallowedRole(grantee, ['ReceptionAgent'])

export const canEditBeneficiaryRelatives = canListBeneficiaryRelatives
