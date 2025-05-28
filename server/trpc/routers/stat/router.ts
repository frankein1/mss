import { statRoutes as routes } from '~/server/route'
import { protectedProcedure, router } from '~/server/trpc'

export const statRouter = router({
  getAccommodationZoneStatsPost: protectedProcedure
    .input(routes.getAccommodationZoneStatsPost.inputValidation)
    .mutation(routes.getAccommodationZoneStatsPost.execute),
  getAccommodationModeStatsPost: protectedProcedure
    .input(routes.getAccommodationModeStatsPost.inputValidation)
    .mutation(routes.getAccommodationModeStatsPost.execute),
  getAgeStatsPost: protectedProcedure
    .input(routes.getAgeStatsPost.inputValidation)
    .mutation(routes.getAgeStatsPost.execute),
  getBeneficiaryCountPost: protectedProcedure
    .input(routes.getBeneficiaryCountPost.inputValidation)
    .mutation(routes.getBeneficiaryCountPost.execute),
  getFamilyFileCountPost: protectedProcedure
    .input(routes.getFamilyFileCountPost.inputValidation)
    .mutation(routes.getFamilyFileCountPost.execute),
  getCSPStatsPost: protectedProcedure
    .input(routes.getCSPStatsPost.inputValidation)
    .mutation(routes.getCSPStatsPost.execute),
  getFamilyStatsPost: protectedProcedure
    .input(routes.getFamilyStatsPost.inputValidation)
    .mutation(routes.getFamilyStatsPost.execute),
  getHousingHelpRequestsStats: protectedProcedure
    .input(routes.getHousingHelpRequestsStatsQ.inputValidation)
    .query(routes.getHousingHelpRequestsStatsQ.execute),
  getFollowupActionsEntreprisesStats: protectedProcedure
    .input(routes.getFollowupActionsEntreprisesStatsQ.inputValidation)
    .query(routes.getFollowupActionsEntreprisesStatsQ.execute),
  getFollowupMediumStats: protectedProcedure
    .input(routes.getFollowupMediumStatsQ.inputValidation)
    .query(routes.getFollowupMediumStatsQ.execute),
  getFollowupMinistreStats: protectedProcedure
    .input(routes.getFollowupMinistreStatsQ.inputValidation)
    .query(routes.getFollowupMinistreStatsQ.execute),
  getFollowupPrescribingOrganizationStats: protectedProcedure
    .input(routes.getFollowupPrescribingOrganizationStatsQ.inputValidation)
    .query(routes.getFollowupPrescribingOrganizationStatsQ.execute),
  getFollowupStatusStats: protectedProcedure
    .input(routes.getFollowupStatusStatsQ.inputValidation)
    .query(routes.getFollowupStatusStatsQ.execute),
  getGenderStatsPost: protectedProcedure
    .input(routes.getGenderStatsPost.inputValidation)
    .mutation(routes.getGenderStatsPost.execute),
  getHelpRequestMinistreStats: protectedProcedure
    .input(routes.getHelpRequestMinistreStatsQ.inputValidation)
    .query(routes.getHelpRequestMinistreStatsQ.execute),
  getHelpRequestPrescribingOrganizationStats: protectedProcedure
    .input(routes.getHelpRequestPrescribingOrganizationStatsQ.inputValidation)
    .query(routes.getHelpRequestPrescribingOrganizationStatsQ.execute),
  getHelpRequestAmountsBySubject: protectedProcedure
    .input(routes.getHelpRequestAmountsBySubjectQ.inputValidation)
    .query(routes.getHelpRequestAmountsBySubjectQ.execute),
  getHelpRequestInstructionsStats: protectedProcedure
    .input(routes.getHelpRequestInstructionsStatsQ.inputValidation)
    .query(routes.getHelpRequestInstructionsStatsQ.execute),
  getHelpRequestStatusStats: protectedProcedure
    .input(routes.getHelpRequestStatusStatsQ.inputValidation)
    .query(routes.getHelpRequestStatusStatsQ.execute),
  getHelpRequestAmountsByInstructorOrganization: protectedProcedure
    .input(
      routes.getHelpRequestAmountsByInstructorOrganizationQ.inputValidation
    )
    .query(routes.getHelpRequestAmountsByInstructorOrganizationQ.execute),
  getHelpRequestAmountsAllocated: protectedProcedure
    .input(routes.getHelpRequestAmountsAllocatedQ.inputValidation)
    .query(routes.getHelpRequestAmountsAllocatedQ.execute),
  getFileInstructionTypeStats: protectedProcedure
    .input(routes.getFileInstructionTypeStatsQ.inputValidation)
    .query(routes.getFileInstructionTypeStatsQ.execute),
  getHistoryCounts: protectedProcedure
    .input(routes.getHistoryCountsQuery.inputValidation)
    .query(routes.getHistoryCountsQuery.execute),
  getMobilityStatsPost: protectedProcedure
    .input(routes.getMobilityStatsPost.inputValidation)
    .mutation(routes.getMobilityStatsPost.execute),
  getCityStatsPost: protectedProcedure
    .input(routes.getCityStatsPost.inputValidation)
    .mutation(routes.getCityStatsPost.execute),
  getDepartmentStatsPost: protectedProcedure
    .input(routes.getDepartmentStatsPost.inputValidation)
    .mutation(routes.getDepartmentStatsPost.execute),
  getRegionStatsPost: protectedProcedure
    .input(routes.getRegionStatsPost.inputValidation)
    .mutation(routes.getRegionStatsPost.execute),
  getFollowupSubjectStats: protectedProcedure
    .input(routes.getFollowupSubjectsStatsQ.inputValidation)
    .query(routes.getFollowupSubjectsStatsQ.execute),
  getFollowupDurationStats: protectedProcedure
    .input(routes.getFollowupDurationStatsQ.inputValidation)
    .query(routes.getFollowupDurationStatsQ.execute),
  getFollowupMeanTimeStats: protectedProcedure
    .input(routes.getFollowupMeanTimeStatsQ.inputValidation)
    .query(routes.getFollowupMeanTimeStatsQ.execute),
  getHelpRequestSubjectStats: protectedProcedure
    .input(routes.getHelpRequestSubjectsStatsQ.inputValidation)
    .query(routes.getHelpRequestSubjectsStatsQ.execute),
  getMinistereStructureStatsPost: protectedProcedure
    .input(routes.getMinistereStructureStatsPost.inputValidation)
    .mutation(routes.getMinistereStructureStatsPost.execute),
  getMinistereCategorieStatsPost: protectedProcedure
    .input(routes.getMinistereCategorieStatsPost.inputValidation)
    .mutation(routes.getMinistereCategorieStatsPost.execute),
  getMinistereInterpellationStatsPost: protectedProcedure
    .input(routes.getMinistereInterpellationStatsPost.inputValidation)
    .mutation(routes.getMinistereInterpellationStatsPost.execute),
  getMinistereDepartementServiceAcStatsPost: protectedProcedure
    .input(routes.getMinistereDepartementServiceAcStatsPost.inputValidation)
    .mutation(routes.getMinistereDepartementServiceAcStatsPost.execute),
  exportBeneficiaryStatsPost: protectedProcedure
    .input(routes.exportBeneficiaryStatsPost.inputValidation)
    .mutation(routes.exportBeneficiaryStatsPost.execute),
  exportHelpRequestStats: protectedProcedure
    .input(routes.exportHelpRequestStatsQuery.inputValidation)
    .query(routes.exportHelpRequestStatsQuery.execute),
  exportFollowupStats: protectedProcedure
    .input(routes.exportFollowupStatsQuery.inputValidation)
    .query(routes.exportFollowupStatsQuery.execute),
  getHelpRequestBeneficiaryNumber: protectedProcedure
    .input(routes.getHelpRequestBeneficiaryNumberQ.inputValidation)
    .query(routes.getHelpRequestBeneficiaryNumberQ.execute),
  getFollowupBeneficiaryNumber: protectedProcedure
    .input(routes.getFollowupBeneficiaryNumberQ.inputValidation)
    .query(routes.getFollowupBeneficiaryNumberQ.execute)
})
