import { StructureType } from '@prisma/client'
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
      'Instructor',
      'Referent'
    ]) && isPartOfReferents(grantee, beneficiary)
  )
}
