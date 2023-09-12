import type { SecurityRuleGrantee, SecurityTargetWithCreator } from './types'
import { isCreator } from './helpers'

export const canViewBeneficiaryDraft = (
  grantee: SecurityRuleGrantee,
  beneficiaryDraft: SecurityTargetWithCreator
): boolean => isCreator(grantee, beneficiaryDraft)

export const canUpdateBeneficiaryDraft = canViewBeneficiaryDraft
export const canSaveToBeneficiaryBeneficiaryDraft = canViewBeneficiaryDraft
export const canDeleteBeneficiaryDraft = canViewBeneficiaryDraft
