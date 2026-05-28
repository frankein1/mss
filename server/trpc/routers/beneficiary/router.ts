import { beneficiaryRoutes as routes } from '~/server/route'
import { protectedProcedure, router } from '~/server/trpc'

export const beneficiaryRouter = router({
  getBeneficiaryDetails: protectedProcedure
    .input(routes.getBeneficiaryDetailsQuery.inputValidation)
    .query(routes.getBeneficiaryDetailsQuery.execute),
  getBeneficiaryList: protectedProcedure
    .input(routes.getBeneficiaryListQuery.inputValidation)
    .query(routes.getBeneficiaryListQuery.execute),
  exportBeneficiaries: protectedProcedure
    .input(routes.exportBeneficiariesQuery.inputValidation)
    .query(routes.exportBeneficiariesQuery.execute),
  exportBeneficiary: protectedProcedure
    .input(routes.exportBeneficiaryQuery.inputValidation)
    .query(routes.exportBeneficiaryQuery.execute),
  search: protectedProcedure
    .input(routes.searchBeneficiaryQuery.inputValidation)
    .query(routes.searchBeneficiaryQuery.execute),
  getTaxHouseholds: protectedProcedure
    .input(routes.getBeneficiaryTaxHouseholdsQuery.inputValidation)
    .query(routes.getBeneficiaryTaxHouseholdsQuery.execute),
  getSimilar: protectedProcedure
    .input(routes.getSimilarBeneficiaryQuery.inputValidation)
    .query(routes.getSimilarBeneficiaryQuery.execute),
  getBeneficiaryArchivePermission: protectedProcedure
    .input(routes.getBeneficiaryArchivePermissionsQuery.inputValidation)
    .query(routes.getBeneficiaryArchivePermissionsQuery.execute),
  delete: protectedProcedure
    .input(routes.deleteBeneficiaryMutation.inputValidation)
    .mutation(routes.deleteBeneficiaryMutation.execute),
  archiveBeneficiary: protectedProcedure
    .input(routes.archiveBeneficiaryMutation.inputValidation)
    .query(routes.archiveBeneficiaryMutation.execute),
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
  updateDevices: protectedProcedure
    .input(routes.updateDevicesMutation.inputValidation)
    .mutation(routes.updateDevicesMutation.execute),
  getDeviceNameList: protectedProcedure
    .input(routes.getDeviceNameListQuery.inputValidation)
    .query(routes.getDeviceNameListQuery.execute),
  getDevicesForBeneficiary: protectedProcedure
    .input(routes.getDevicesForBeneficiaryQuery.inputValidation)
    .query(routes.getDevicesForBeneficiaryQuery.execute),
  checkDeviceHasFollowup: protectedProcedure
    .input(routes.checkDeviceHasFollowupQuery.inputValidation)
    .query(routes.checkDeviceHasFollowupQuery.execute),
  updateArchiveDate: protectedProcedure
    .input(routes.updateArchiveDateMutation.inputValidation)
    .mutation(routes.updateArchiveDateMutation.execute),
  create: protectedProcedure
    .input(routes.createBeneficiaryMutation.inputValidation)
    .mutation(routes.createBeneficiaryMutation.execute),
  createFamilyFileMember: protectedProcedure
    .input(routes.createFamilyFileMemberMutation.inputValidation)
    .mutation(routes.createFamilyFileMemberMutation.execute),
  linkToFamilyFile: protectedProcedure
    .input(routes.linkToFamilyFileMutation.inputValidation)
    .mutation(routes.linkToFamilyFileMutation.execute),
  checkDeviceHasFollowup: protectedProcedure
    .input(routes.checkDeviceHasFollowupQuery.inputValidation)
    .query(routes.checkDeviceHasFollowupQuery.execute)
})
