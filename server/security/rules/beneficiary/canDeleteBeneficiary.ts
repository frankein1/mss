import { isInSameStructureAs } from '~/server/security/rules/helpers'
import {
  SecurityRuleGrantee,
  SecurityTargetWithStructure
} from '~/server/security/rules/types'

export const canDeleteBeneficiary = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure
): boolean => isInSameStructureAs(grantee, beneficiary, ['StructureManager'])
