import type {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityTargetWithReferents
} from './types'
import { BeneficiaryRules } from '~/server/security'

export const canAddComment = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean => BeneficiaryRules.select.general(grantee, beneficiary)

export const canListComments = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean => BeneficiaryRules.select.general(grantee, beneficiary)
