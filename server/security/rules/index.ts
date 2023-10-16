import type {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityTargetWithReferents,
  SecurityRule
} from './types'
import { hasAllowedRole } from './helpers'
export { hasAllowedRole }

export type {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityTargetWithReferents,
  SecurityRule
}

export {
  canCreateUser,
  canEditUser,
  canEditUserRole,
  canListUsers
} from './user'

export { canEditItsOwnStructure } from './structure'

export {
  canOnlyListItsBeneficiaries,
  canViewBeneficiaryHealthInfo,
  canViewBeneficiaryOccupationIncome,
  canViewBeneficiaryExternalOrganisations,
  canEditBeneficiaryHealthInfo,
  canEditBeneficiaryOccupationIncome,
  canEditBeneficiaryExternalOrganisations,
  canDeleteBeneficiary,
  canEditBeneficiaryReferents,
  canViewBeneficiaryNir,
  canSetBeneficiaryNir,
  canSaveToBeneficiaryBeneficiaryDraft
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
  canOnlyListItsUploadedDocuments,
  canViewDocument,
  canSetDocumentAsConfidential
} from './document'

export {
  canCreateFollowup,
  canDeleteFollowup,
  canEditFollowup,
  canEditFollowupPrivateSynthesis,
  canViewFollowup,
  canViewFollowupPrivateSynthesis,
  canViewFollowupDetails,
  canViewAnyFollowupDetails
} from './followup'

export {
  canAddCommentToFollowup,
  canListCommentsToFollowup,
  canAddCommentToHelpRequest,
  canListCommentsToHelpRequest
} from './comment'

export {
  canViewHelpRequestDetails,
  canCreateHelpRequest,
  canDeleteHelpRequest,
  canEditHelpRequest,
  canEditHelpRequestPrivateSynthesis,
  canListBeneficiaryHelpRequests,
  canViewHelpRequest,
  canViewHelpRequestPrivateSynthesis,
  canViewAnyHelpRequestDetails
} from './helpRequest'

export { canViewStats, canViewStatsByReferent } from './stats'

export {
  canExportBeneficiaries,
  canExportHistory,
  canExportStats
} from './export'

// A rule is a synchronous function taking
// -- grantee (the authenticated user)
// -- target (aggregate info or scope of the action)
// -- params (specifics about the action)
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
