import type {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityTargetWithReferents
} from './types'
import { isInSameStructureAs, isReferentFor } from './helpers'

const canDoOnComment = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
) => {
  return (
    isInSameStructureAs(grantee, beneficiary, [
      'StructureManager',
      'SocialWorker',
      'Instructor',
      'ReceptionAgent'
    ]) || isReferentFor(grantee, beneficiary)
  )
}

export const canAddComment = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean => canDoOnComment(grantee, beneficiary)

export const canListComments = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean => canDoOnComment(grantee, beneficiary)
