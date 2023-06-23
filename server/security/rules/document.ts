import type {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityTargetWithReferents,
  SecurityTargetWithCreator
} from './types'
import {
  hasAllowedRole,
  isInSameStructureAs,
  isReferentFor,
  isCreator
} from './helpers'

export const canAddDocument = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) || isReferentFor(grantee, beneficiary)

export const canListDocuments = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) || isReferentFor(grantee, beneficiary)

export const canListConfidentialDocuments = (
  grantee: SecurityRuleGrantee
): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'ReceptionAgent',
    'Referent'
  ])

export const canOnlyListItsUploadedDocuments = (
  grantee: SecurityRuleGrantee
): boolean => hasAllowedRole(grantee, ['ReceptionAgent'])

export const canViewDocument = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  document: SecurityTargetWithCreator & { confidential: boolean }
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker'
  ]) ||
  isReferentFor(grantee, beneficiary) ||
  (isInSameStructureAs(grantee, beneficiary, ['Instructor']) &&
    document.confidential) ||
  (isInSameStructureAs(grantee, beneficiary, ['ReceptionAgent']) &&
    isCreator(grantee, document))

export const canEditDocument = canViewDocument

export const canSetDocumentAsConfidential = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  document: SecurityTargetWithCreator
): boolean =>
  (isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'ReceptionAgent'
  ]) ||
    isReferentFor(grantee, beneficiary)) &&
  isCreator(grantee, document)

export const canDeleteDocument = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker'
  ]) || isReferentFor(grantee, beneficiary)
