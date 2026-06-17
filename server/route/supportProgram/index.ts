import { getSupportProgramNameListQuery } from './get-name-list.query'
import { getSupportProgramsForBeneficiaryQuery } from './get-for-beneficiary.query'
import { checkSupportProgramHasFollowupQuery } from './check-has-followup.query'
import { getSupportProgramNamesForFamilyFileQuery } from './get-names-for-family-file.query'
import { upsertNameMutation } from './upsert-name.mutation'
import { deleteNameMutation } from './delete-name.mutation'
import { countNameUsageQuery } from './count-name-usage.query'

export const supportProgramRoutes = {
  getSupportProgramNameListQuery,
  getSupportProgramsForBeneficiaryQuery,
  checkSupportProgramHasFollowupQuery,
  getSupportProgramNamesForFamilyFileQuery,
  upsertNameMutation,
  deleteNameMutation,
  countNameUsageQuery
}
