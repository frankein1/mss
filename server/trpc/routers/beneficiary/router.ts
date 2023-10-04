import {
  isBeneficiaryReferentQuery,
  getBeneficiaryDetailsQuery,
  getBeneficiaryHistoryQuery,
  getBeneficiariesQuery,
  exportBeneficiariesQuery,
  getBeneficiaryDocumentsQuery,
  searchBeneficiaryQuery,
  getBeneficiaryFollowupTypesQuery,
  getBeneficiaryMinimalInfoQuery,
  getBeneficiarySecurityTargetQuery,
  deleteBeneficiaryMutation,
  createBeneficiaryMutation,
  updateGeneralInformationMutation,
  updateEntourageMutation,
  updateHealthMutation,
  updateOccupationIncomeMutation,
  updateExternalOrganisationsMutation,
  saveDraftMutation,
  updateTaxHouseholdMutation
} from '~/server/request/beneficiary'
import { protectedProcedure, router } from '~/server/trpc'

export const beneficiaryRouter = router({
  isBeneficiaryReferent: protectedProcedure
    .input(isBeneficiaryReferentQuery.inputValidation)
    .query(isBeneficiaryReferentQuery.execute),
  getBeneficiaryMinimalInfo: protectedProcedure
    .input(getBeneficiaryMinimalInfoQuery.inputValidation)
    .query(getBeneficiaryMinimalInfoQuery.execute),
  getBeneficiaryDetails: protectedProcedure
    .input(getBeneficiaryDetailsQuery.inputValidation)
    .query(getBeneficiaryDetailsQuery.execute),
  getBeneficiarySecurityTarget: protectedProcedure
    .input(getBeneficiarySecurityTargetQuery.inputValidation)
    .query(getBeneficiarySecurityTargetQuery.execute),
  getBeneficiaryHistory: protectedProcedure
    .input(getBeneficiaryHistoryQuery.inputValidation)
    .query(getBeneficiaryHistoryQuery.execute),
  getBeneficiaries: protectedProcedure
    .input(getBeneficiariesQuery.inputValidation)
    .query(getBeneficiariesQuery.execute),
  exportBeneficiaries: protectedProcedure
    .input(exportBeneficiariesQuery.inputValidation)
    .query(exportBeneficiariesQuery.execute),
  search: protectedProcedure
    .input(searchBeneficiaryQuery.inputValidation)
    .query(searchBeneficiaryQuery.execute),
  getBeneficiaryFollowupTypes: protectedProcedure
    .input(getBeneficiaryFollowupTypesQuery.inputValidation)
    .query(getBeneficiaryFollowupTypesQuery.execute),
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
