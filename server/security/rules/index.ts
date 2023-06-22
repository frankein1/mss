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

export type { SecurityTargetWithStructure, SecurityTargetWithReferents }

export {
  canCreateUser,
  canEditUser,
  canEditUserRole,
  canListUsers
} from './user'

export { canEditItsOwnStructure } from './structure'

export {
  canOnlyListItsBeneficiaries,
  canViewBeneficiary,
  canViewBeneficiaryHealthInfo,
  canViewBeneficiaryOccupationIncome,
  canViewBeneficiaryExternalOrganisations,
  canEditBeneficiary,
  canEditBeneficiaryHealthInfo,
  canEditBeneficiaryOccupationIncome,
  canEditBeneficiaryExternalOrganisations,
  canDeleteBeneficiary,
  canEditBeneficiaryReferents
} from './beneficiary'

export {
  canListBeneficiaryRelatives,
  canEditBeneficiaryRelatives
} from './relative'

export {
  canAddDocument,
  canDeleteDocument,
  canEditDocument,
  canListDocuments,
  canListConfidentialDocuments,
  canOnlyListItsUploadedDocuments,
  canViewDocument
} from './document'

export {
  canCreateFollowup,
  canDeleteFollowup,
  canEditFollowup,
  canEditFollowupPrivateSynthesis,
  canListBeneficiaryFollowups,
  canViewFollowup,
  canViewFollowupPrivateSynthesis,
  canViewFollowupDetails,
  canEditFollowupStatus
} from './followup'

export { canAddCommentToFollowup, canListCommentsToFollowup } from './comment'

// A rule is a synchronous function taking
// -- grantee (the authenticated user)
// -- target (aggregate info or scope of the action)
// -- params (specifics about the action)

export const canEditBeneficiaryHelpRequestPrivateSynthesis = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure,
  helpRequest: SecurityTargetWithCreator
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ]) && isCreator(grantee, helpRequest)

export const canCreateBeneficiaryHelpRequest = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor'
  ]) || isReferentFor(grantee, beneficiary)

export const canListBeneficiaryHelpRequests = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) || isReferentFor(grantee, beneficiary)

export const canAccessProtectedDataInHelpRequest = (
  grantee: SecurityRuleGrantee
): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])

export const canViewBeneficiaryHelpRequest = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  helpRequest: SecurityTargetWithCreator
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker'
  ]) ||
  (isInSameStructureAs(grantee, beneficiary, ['Instructor']) &&
    isCreator(grantee, helpRequest)) ||
  isReferentFor(grantee, beneficiary)

export const canViewBeneficiaryHelpRequestSynthesis = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  helpRequest: SecurityTargetWithCreator
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker'
  ]) ||
  (isInSameStructureAs(grantee, beneficiary, ['Instructor']) &&
    isCreator(grantee, helpRequest)) ||
  isReferentFor(grantee, beneficiary)

export const canViewBeneficiaryHelpRequestPrivateSynthesis = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure,
  helpRequest: SecurityTargetWithCreator
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) && isCreator(grantee, helpRequest)

export const canEditBeneficiaryHelpRequest = (
  grantee: SecurityRuleGrantee,
  helpRequest: SecurityTargetWithCreator & SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, helpRequest, ['StructureManager']) ||
  (isInSameStructureAs(grantee, helpRequest, ['SocialWorker', 'Instructor']) &&
    isCreator(grantee, helpRequest))

export const canAddCommentToBeneficiaryHelpRequest =
  canListBeneficiaryHelpRequests
export const canListCommentsToBeneficiaryHelpRequest = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor'
  ]) || isReferentFor(grantee, beneficiary)

export const canDeleteBeneficiaryHelpRequest = (
  grantee: SecurityRuleGrantee,
  helpRequest: SecurityTargetWithCreator & SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, helpRequest, [
    'StructureManager',
    'SocialWorker'
  ]) ||
  (isInSameStructureAs(grantee, helpRequest, ['Instructor']) &&
    isCreator(grantee, helpRequest))

export const canAccessSocialRightsSimulator = (): boolean => true

export const canAccessFollowupsPage = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, target, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
    'Referent'
  ])

export const canExportFollowupsData = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, target, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])

export const canAccessStatsPage = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])

export const canExportStats = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, target, ['StructureManager', 'SocialWorker'])

export const canCreatePrescribingOrganization = (
  grantee: SecurityRuleGrantee
): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])

export const canCreateInstructorOrganization = (
  grantee: SecurityRuleGrantee
): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])
