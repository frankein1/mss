import { beneficiaryRoutes as routes } from '~/server/route'
import { protectedProcedure, router } from '~/server/trpc'

export const beneficiaryRouter = router({
  getBeneficiaryMinimalInfo: protectedProcedure
    .input(routes.getBeneficiaryMinimalInfoQuery.inputValidation)
    .query(routes.getBeneficiaryMinimalInfoQuery.execute),
  getBeneficiaryDetails: protectedProcedure
    .input(routes.getBeneficiaryDetailsQuery.inputValidation)
    .query(routes.getBeneficiaryDetailsQuery.execute),
  getPage: protectedProcedure
    .input(routes.getPage.inputValidation)
    .query(routes.getPage.execute),
  exportBeneficiaries: protectedProcedure
    .input(routes.exportBeneficiariesQuery.inputValidation)
    .query(routes.exportBeneficiariesQuery.execute),
  search: protectedProcedure
    .input(routes.searchBeneficiaryQuery.inputValidation)
    .query(routes.searchBeneficiaryQuery.execute),
  getTaxHouseholds: protectedProcedure
    .input(routes.getBeneficiaryTaxHouseholdsQuery.inputValidation)
    .query(routes.getBeneficiaryTaxHouseholdsQuery.execute),
  getSimilar: protectedProcedure
    .input(routes.getSimilarBeneficiaryQuery.inputValidation)
    .query(routes.getSimilarBeneficiaryQuery.execute),

  delete: protectedProcedure
    .input(routes.deleteBeneficiaryMutation.inputValidation)
    .mutation(routes.deleteBeneficiaryMutation.execute),
  deleteDraft: protectedProcedure
    .input(routes.deleteBeneficiaryDraftMutation.inputValidation)
    .mutation(routes.deleteBeneficiaryDraftMutation.execute),
  updateGeneralInformation: protectedProcedure
    .input(routes.updateGeneralInformationMutation.inputValidation)
    .mutation(routes.updateGeneralInformationMutation.execute),
  updateTaxHousehold: protectedProcedure
    .input(routes.updateTaxHouseholdMutation.inputValidation)
    .mutation(routes.updateTaxHouseholdMutation.execute),
  updateEntourage: protectedProcedure
    .input(routes.updateEntourageMutation.inputValidation)
    .mutation(routes.updateEntourageMutation.execute),
  updateHealth: protectedProcedure
    .input(routes.updateHealthMutation.inputValidation)
    .mutation(routes.updateHealthMutation.execute),
  updateOccupationIncome: protectedProcedure
    .input(routes.updateOccupationIncomeMutation.inputValidation)
    .mutation(routes.updateOccupationIncomeMutation.execute),
  updateExternalOrganisations: protectedProcedure
    .input(routes.updateExternalOrganisationsMutation.inputValidation)
    .mutation(routes.updateExternalOrganisationsMutation.execute),
  create: protectedProcedure
    .input(routes.createBeneficiaryMutation.inputValidation)
    .mutation(routes.createBeneficiaryMutation.execute),
  createTaxHouseholdMember: protectedProcedure
    .input(routes.createTaxHouseholdMemberMutation.inputValidation)
    .mutation(routes.createTaxHouseholdMemberMutation.execute),
  validate: protectedProcedure
    .input(routes.validateBeneficiaryMutation.inputValidation)
    .mutation(routes.validateBeneficiaryMutation.execute),
  addFamilyFileMember: protectedProcedure
    .input(routes.addFamilyFileMemberMutation.inputValidation)
    .mutation(routes.addFamilyFileMemberMutation.execute)
})
