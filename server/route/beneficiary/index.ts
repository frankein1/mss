import { exportBeneficiariesQuery } from './export.query'
import { getBeneficiaryDetailsQuery } from './get-details.query'
import { getBeneficiaryMinimalInfoQuery } from './get-minimal-info.query'
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
import { validateBeneficiaryMutation } from './validate.mutation'
import { createTaxHouseholdMemberMutation } from './create-household-member.mutation'

export const beneficiaryRoutes = {
  exportBeneficiariesQuery,
  getBeneficiaryDetailsQuery,
  getBeneficiaryMinimalInfoQuery,
  getPage,
  searchBeneficiaryQuery,
  getBeneficiaryTaxHouseholdsQuery,
  getSimilarBeneficiaryQuery,
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
  createTaxHouseholdMemberMutation
}

export type { SimilarBeneficiary }
