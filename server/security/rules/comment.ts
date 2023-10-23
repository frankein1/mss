import type {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityTargetWithReferents
} from './types'
import { BeneficiaryRights } from '~/server/security'

export const canAddComment = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean => BeneficiaryRights.read.general(grantee, beneficiary)

export const canListComments = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean => BeneficiaryRights.read.general(grantee, beneficiary)
