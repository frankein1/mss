import type {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityTargetWithReferents,
  SecurityRule
} from './types'
import { AllowSecurityCheck } from './types'
import { hasAllowedRole } from './helpers'
export { hasAllowedRole, AllowSecurityCheck }

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

export {
  canOnlyListItsBeneficiaries,
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
  canListBeneficiaryFollowups,
  canViewFollowup,
  canViewFollowupPrivateSynthesis,
  canViewFollowupDetails,
  canViewAnyFollowupDetails
} from './followup'

export { canAddComment, canListComments } from './comment'

export {
  canViewHelpRequestDetails,
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
