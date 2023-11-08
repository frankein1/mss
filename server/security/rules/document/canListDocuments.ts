import { isInSameStructureAs, isReferentFor } from '../helpers'
import {
  SecurityRuleGrantee,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure
} from '../types'

export const canListDocuments = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) || isReferentFor(grantee, beneficiary)
