import type {
  BeneficiaryWithFollowupTypesFromFollowupsAndHelpRequests,
  FollowupTypesFromFollowups,
  FollowupTypesFromHelpRequests
} from './get-page.handler'

export { getBeneficiaryDetailsHandler } from './get-details.handler'
export { getBeneficiariesHandler } from './get-page.handler'
export { createBeneficiaryHandler } from './create.handler'
export { updateBeneficiaryHandler } from './update.handler'
export { searchBeneficiaryHandler } from './search.handler'

export type {
  BeneficiaryWithFollowupTypesFromFollowupsAndHelpRequests,
  FollowupTypesFromFollowups,
  FollowupTypesFromHelpRequests
}
