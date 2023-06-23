import type {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityTargetWithReferents
} from './types'
import { hasAllowedRole } from './helpers'

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

// A rule is a synchronous function taking
// -- grantee (the authenticated user)
// -- target (aggregate info or scope of the action)
// -- params (specifics about the action)
export const canAccessStatsPage = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])

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
