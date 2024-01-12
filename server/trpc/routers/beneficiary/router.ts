import {
  getBeneficiaryDetailsQuery,
  getSocialSupports,
  getPage,
  exportBeneficiariesQuery,
  getBeneficiaryDocumentsQuery,
  searchBeneficiaryQuery,
  getBeneficiaryMinimalInfoQuery,
  deleteBeneficiaryMutation,
  createBeneficiaryMutation,
  updateGeneralInformationMutation,
  updateEntourageMutation,
  updateHealthMutation,
  updateOccupationIncomeMutation,
  updateExternalOrganisationsMutation,
  saveDraftMutation,
  updateTaxHouseholdMutation
} from '~/server/route/beneficiary'
import { protectedProcedure, router } from '~/server/trpc'

export const beneficiaryRouter = router({
  getBeneficiaryMinimalInfo: protectedProcedure
    .input(getBeneficiaryMinimalInfoQuery.inputValidation)
    .query(getBeneficiaryMinimalInfoQuery.execute),
  getBeneficiaryDetails: protectedProcedure
    .input(getBeneficiaryDetailsQuery.inputValidation)
    .query(getBeneficiaryDetailsQuery.execute),
  getSocialSupports: protectedProcedure
    .input(getSocialSupports.inputValidation)
    .query(getSocialSupports.execute),
  getPage: protectedProcedure
    .input(getPage.inputValidation)
    .query(getPage.execute),
  exportBeneficiaries: protectedProcedure
    .input(exportBeneficiariesQuery.inputValidation)
    .query(exportBeneficiariesQuery.execute),
  search: protectedProcedure
    .input(searchBeneficiaryQuery.inputValidation)
    .query(searchBeneficiaryQuery.execute),
  getBeneficiaryDocuments: protectedProcedure
    .input(getBeneficiaryDocumentsQuery.inputValidation)
    .query(getBeneficiaryDocumentsQuery.execute),

  delete: protectedProcedure
    .input(deleteBeneficiaryMutation.inputValidation)
    .mutation(deleteBeneficiaryMutation.execute),
  updateGeneralInformation: protectedProcedure
    .input(updateGeneralInformationMutation.inputValidation)
    .mutation(updateGeneralInformationMutation.execute),
  updateTaxHousehold: protectedProcedure
    .input(updateTaxHouseholdMutation.inputValidation)
    .mutation(updateTaxHouseholdMutation.execute),
  updateEntourage: protectedProcedure
    .input(updateEntourageMutation.inputValidation)
    .mutation(updateEntourageMutation.execute),
  updateHealth: protectedProcedure
    .input(updateHealthMutation.inputValidation)
    .mutation(updateHealthMutation.execute),
  updateOccupationIncome: protectedProcedure
    .input(updateOccupationIncomeMutation.inputValidation)
    .mutation(updateOccupationIncomeMutation.execute),
  updateExternalOrganisations: protectedProcedure
    .input(updateExternalOrganisationsMutation.inputValidation)
    .mutation(updateExternalOrganisationsMutation.execute),
  create: protectedProcedure
    .input(createBeneficiaryMutation.inputValidation)
    .mutation(createBeneficiaryMutation.execute),
  saveDraft: protectedProcedure
    .input(saveDraftMutation.inputValidation)
    .mutation(saveDraftMutation.execute)
})
