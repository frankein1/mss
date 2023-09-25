import { isCreator } from '~/server/security/rules/helpers'
import {
  SecurityRuleGrantee,
  SecurityTargetWithCreator
} from '~/server/security/rules/types'

export const canSaveToBeneficiaryBeneficiaryDraft = (
  grantee: SecurityRuleGrantee,
  beneficiaryDraft: SecurityTargetWithCreator
): boolean => isCreator(grantee, beneficiaryDraft)
