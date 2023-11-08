import { isCreator, isInSameStructureAs, isReferentFor } from '../helpers'
import {
  SecurityRuleGrantee,
  SecurityTargetWithCreator,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure
} from '../types'

const canViewConfidentialDocument = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  document: SecurityTargetWithCreator
): boolean =>
  (isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) ||
    isReferentFor(grantee, beneficiary)) &&
  isCreator(grantee, document)

const canViewNonConfidentialDocument = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  document: SecurityTargetWithCreator
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor'
  ]) ||
  isReferentFor(grantee, beneficiary) ||
  (isInSameStructureAs(grantee, beneficiary, ['ReceptionAgent']) &&
    isCreator(grantee, document))

export const canViewDocument = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  document: SecurityTargetWithCreator & { confidential: boolean }
): boolean =>
  document.confidential
    ? canViewConfidentialDocument(grantee, beneficiary, document)
    : canViewNonConfidentialDocument(grantee, beneficiary, document)

export const canEditDocument = canViewDocument
