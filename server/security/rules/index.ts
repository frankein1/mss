import type {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityTargetWithReferents,
  SecurityRule
} from './types'
import { hasAllowedRole, isReferent } from './helpers'
export { hasAllowedRole, isReferent }

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
  canViewBeneficiaryGeneral,
  canViewBeneficiaryHealthInfo,
  canViewBeneficiaryOccupationIncome,
  canViewBeneficiaryExternalOrganisations,
  canEditBeneficiaryGeneral,
  canEditBeneficiaryHealthInfo,
  canEditBeneficiaryOccupationIncome,
  canEditBeneficiaryExternalOrganisations,
  canDeleteBeneficiary,
  canEditBeneficiaryReferents,
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
  canListBeneficiaryFollowups,
  canViewFollowup,
  canViewFollowupPrivateSynthesis,
  canViewFollowupDetails,
  canViewAnyFollowupDetails
} from './followup'

export { canAddComment, canListComments } from './comment'

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

export { canViewDraft, canUpdateDraft, canDeleteDraft } from './draft'

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
