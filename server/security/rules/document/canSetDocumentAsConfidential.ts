import { isCreator, isInSameStructureAs, isReferentFor } from '../helpers'
import {
  SecurityRuleGrantee,
  SecurityTargetWithCreator,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure
} from '../types'

export const canSetDocumentAsConfidential = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  document: SecurityTargetWithCreator
): boolean =>
  (isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) ||
    isReferentFor(grantee, beneficiary)) &&
  isCreator(grantee, document)
