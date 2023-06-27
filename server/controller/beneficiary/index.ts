import type {
  BeneficiaryWithFollowupTypesFromFollowupsAndHelpRequests,
  FollowupTypesFromFollowups,
  FollowupTypesFromHelpRequests
} from './get-page.handler'

export { getBeneficiaryDetailsHandler } from './get-details.handler'
export { getBeneficiariesHandler } from './get-page.handler'
export { getBeneficiaryDocumentsHandler } from './get-documents.handler'
export { createBeneficiaryHandler } from './create.handler'
export { updateBeneficiaryHandler } from './update.handler'
export { searchBeneficiaryHandler } from './search.handler'
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
