import { createFamilyFileMemberMutation } from './create-family-file-member.mutation'
import { exportBeneficiariesQuery } from './export-all.query'
import { exportBeneficiaryQuery } from './exportBeneficiary.query'
import { archiveBeneficiaryMutation } from './archive.mutation'
import { getBeneficiaryDetailsQuery } from './get-details.query'
import { getPage } from './get-page.query'
import { searchBeneficiaryQuery } from './search.query'
import { updateEntourageMutation } from './update-entourage.mutation'
import { updateExternalOrganisationsMutation } from './update-external-organisations.mutation'
import { updateGeneralInformationMutation } from './update-general-information.mutation'
import { updateHealthMutation } from './update-health.mutation'
import { updateOccupationIncomeMutation } from './update-occupation-income.mutation'
import { updateTaxHouseholdMutation } from './update-tax-household.mutation'
import { createBeneficiaryMutation } from './create.mutation'
import { deleteBeneficiaryMutation } from './delete.mutation'
import { deleteBeneficiaryDraftMutation } from './delete-draft.mutation'
import { getBeneficiaryTaxHouseholdsQuery } from './get-taxhouseholds'
import { SimilarBeneficiary, getSimilarBeneficiaryQuery } from './get-similar'
import { getBeneficiaryArchivePermissionsQuery } from './get-archive-permissions.query'
import { validateBeneficiaryMutation } from './validate.mutation'
import { updateArchiveDateMutation } from './update-archive-date.mutation'

export const beneficiaryRoutes = {
  exportBeneficiariesQuery,
  exportBeneficiaryQuery,
  archiveBeneficiaryMutation,
  getBeneficiaryDetailsQuery,
  getPage,
  searchBeneficiaryQuery,
  getBeneficiaryTaxHouseholdsQuery,
  getSimilarBeneficiaryQuery,
  getBeneficiaryArchivePermissionsQuery,
  updateEntourageMutation,
  updateExternalOrganisationsMutation,
  updateGeneralInformationMutation,
  updateHealthMutation,
  updateOccupationIncomeMutation,
  updateTaxHouseholdMutation,
  createBeneficiaryMutation,
  deleteBeneficiaryMutation,
  deleteBeneficiaryDraftMutation,
  validateBeneficiaryMutation,
  createFamilyFileMemberMutation,
  updateArchiveDateMutation
}

export type { SimilarBeneficiary }
