import {
  SecurityRuleGrantee,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure
} from '~/server/security/rules/types'
import {
  isInSameStructureAs,
  isPartOfReferents
} from '~/server/security/rules/helpers'

export const canViewBeneficiaryHealthInfo = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ]) && isPartOfReferents(grantee, beneficiary)
