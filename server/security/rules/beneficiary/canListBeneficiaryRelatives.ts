import { isInSameStructureAs, isReferentFor } from '../helpers'
import {
  SecurityRuleGrantee,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure
} from '../types'

export const canListBeneficiaryRelatives = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor'
  ]) || isReferentFor(grantee, beneficiary)
