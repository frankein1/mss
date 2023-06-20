import type {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityTargetWithReferents,
  SecurityTargetWithCreator
} from './types'
import {
  hasAllowedRole,
  hasNotDisallowedRole,
  isInSameStructureAs,
  isReferentFor,
  isCreator
} from './helpers'
import { canViewBeneficiary } from './beneficiary'

export const canAddDocument = canViewBeneficiary

export const canListDocuments = canViewBeneficiary

export const canListConfidentialDocuments = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  canListDocuments(grantee, beneficiary) &&
  hasNotDisallowedRole(grantee, ['Instructor'])

export const canOnlyListItsUploadedDocuments = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  canListDocuments(grantee, beneficiary) &&
  hasNotDisallowedRole(grantee, ['ReceptionAgent'])

export const canViewDocument = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  document: SecurityTargetWithCreator & { confidential: boolean }
): boolean =>
  canListDocuments(grantee, beneficiary) &&
  ((hasAllowedRole(grantee, ['Instructor']) && document.confidential) ||
    isCreator(grantee, document, ['ReceptionAgent']))

export const canEditDocument = canViewDocument

export const canDeleteDocument = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker'
  ]) || isReferentFor(grantee, beneficiary)
