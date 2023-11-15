import { StructureType } from '@prisma/client'
import { isInSameStructureAs, isReferentFor } from '../helpers'
import {
  SecurityRuleGrantee,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure
} from '../types'

export const canEditBeneficiaryRelatives = (
  grantee: SecurityRuleGrantee,
  structureType: StructureType,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean => {
  if (structureType === StructureType.EFS) {
    return false
  }
  return (
    isInSameStructureAs(grantee, beneficiary, [
      'StructureManager',
      'SocialWorker',
      'Instructor'
    ]) || isReferentFor(grantee, beneficiary)
  )
}
