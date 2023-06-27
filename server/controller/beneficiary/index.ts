import type {
  BeneficiaryWithFollowupTypesFromFollowupsAndHelpRequests,
  FollowupTypesFromFollowups,
  FollowupTypesFromHelpRequests
} from './get-page.controller'

export { getBeneficiaryDetailsHandler } from './get-details.controller'
export { getBeneficiariesHandler } from './get-page.controller'
export { getBeneficiaryDocumentsHandler } from './get-documents.controller'
export { createBeneficiaryHandler } from './create.controller'
export { updateBeneficiaryHandler } from './update.controller'
export { searchBeneficiaryHandler } from './search.controller'
export { getBeneficiaryMinimalInfoHandler } from './get-minimal-info.controller'
export { getBeneficiaryHistoryHandler } from './get-history.controller'
export { deleteBeneficiaryHandler } from './delete.controller'
export { isBeneficiaryReferentHandler } from './is-beneficiary-referent.controller'
export { getBeneficiarySecurityTargetHandler } from './get-security-target.controller'

export type {
  BeneficiaryWithFollowupTypesFromFollowupsAndHelpRequests,
  FollowupTypesFromFollowups,
  FollowupTypesFromHelpRequests
}
