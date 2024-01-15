import {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  isInSameStructureAs
} from '../rules'
import { isReferentFor } from '../rules/helpers'
import { AllowedRoles, SecurityTargetWithReferents } from '../rules/types'

export const isReferentOrRole = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  allowedRoles: AllowedRoles
): boolean =>
  isInSameStructureAs(grantee, beneficiary, allowedRoles) ||
  isReferentFor(grantee, beneficiary)
