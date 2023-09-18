import type { SecurityRuleGrantee, SecurityTargetWithCreator } from './types'
import { isCreator } from './helpers'

export const canViewDraft = (
  grantee: SecurityRuleGrantee,
  draft: SecurityTargetWithCreator
): boolean => isCreator(grantee, draft)

export const canUpdateDraft = canViewDraft
export const canDeleteDraft = canViewDraft
