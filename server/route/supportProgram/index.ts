import { updateSupportProgramsMutation } from './update.mutation'
import { getSupportProgramNameListQuery } from './get-name-list.query'
import { getSupportProgramsForBeneficiaryQuery } from './get-for-beneficiary.query'
import { checkSupportProgramHasFollowupQuery } from './check-has-followup.query'
import { getSupportProgramNamesForFamilyFileQuery } from './get-names-for-family-file.query'

export const supportProgramRoutes = {
  updateSupportProgramsMutation,
  getSupportProgramNameListQuery,
  getSupportProgramsForBeneficiaryQuery,
  checkSupportProgramHasFollowupQuery,
  getSupportProgramNamesForFamilyFileQuery
}
