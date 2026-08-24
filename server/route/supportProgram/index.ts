import { getSupportProgramNameListQuery } from './get-name-list.query'
import { getActiveSupportProgramNameListQuery } from './get-active-name-list.query'
import { getSupportProgramsForBeneficiaryQuery } from './get-for-beneficiary.query'
import { getSupportProgramNamesForFamilyFileQuery } from './get-names-for-family-file.query'
import { upsertNameMutation } from './upsert-name.mutation'
import { deleteNameMutation } from './delete-name.mutation'
import { countNameUsageQuery } from './count-name-usage.query'
import { countLinkedSocialSupportsQuery } from './count-linked-social-supports.query'

export const supportProgramRoutes = {
  getSupportProgramNameListQuery,
  getActiveSupportProgramNameListQuery,
  getSupportProgramsForBeneficiaryQuery,
  getSupportProgramNamesForFamilyFileQuery,
  upsertNameMutation,
  deleteNameMutation,
  countNameUsageQuery,
  countLinkedSocialSupportsQuery
}
