import { statRoutes as routes } from '~/server/route'
import { protectedProcedure, router } from '~/server/trpc'

export const statRouter = router({
  getAccommodationZoneStats: protectedProcedure
    .input(routes.getAccommodationZoneStatsQ.inputValidation)
    .query(routes.getAccommodationZoneStatsQ.execute),
  getAccommodationZoneStatsPost: protectedProcedure
    .input(routes.getAccommodationZoneStatsPost.inputValidation)
    .mutation(routes.getAccommodationZoneStatsPost.execute),
  getAccommodationModeStats: protectedProcedure
    .input(routes.getAccommodationModeStatsQ.inputValidation)
    .query(routes.getAccommodationModeStatsQ.execute),
  getAccommodationModeStatsPost: protectedProcedure
    .input(routes.getAccommodationModeStatsPost.inputValidation)
    .mutation(routes.getAccommodationModeStatsPost.execute),
  getAgeStats: protectedProcedure
    .input(routes.getAgeStatsQ.inputValidation)
    .query(routes.getAgeStatsQ.execute),
  getAgeStatsPost: protectedProcedure
    .input(routes.getAgeStatsPost.inputValidation)
    .mutation(routes.getAgeStatsPost.execute),
  getBeneficiaryCount: protectedProcedure
    .input(routes.getBeneficiaryCountQ.inputValidation)
    .query(routes.getBeneficiaryCountQ.execute),
  getFamilyFileCount: protectedProcedure
    .input(routes.getFamilyFileCountQ.inputValidation)
    .query(routes.getFamilyFileCountQ.execute),
  getCSPStats: protectedProcedure
    .input(routes.getCSPStatsQ.inputValidation)
    .query(routes.getCSPStatsQ.execute),
  getCSPStatsPost: protectedProcedure
    .input(routes.getCSPStatsPost.inputValidation)
    .mutation(routes.getCSPStatsPost.execute),
  getFamilyStats: protectedProcedure
    .input(routes.getFamilyStatsQ.inputValidation)
    .query(routes.getFamilyStatsQ.execute),
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
  getGenderStats: protectedProcedure
    .input(routes.getGenderStatsQ.inputValidation)
    .query(routes.getGenderStatsQ.execute),
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
  getMobilityStats: protectedProcedure
    .input(routes.getMobilityStatsQ.inputValidation)
    .query(routes.getMobilityStatsQ.execute),
  getCityStats: protectedProcedure
    .input(routes.getCityStatsQ.inputValidation)
    .query(routes.getCityStatsQ.execute),
  getCityStatsPost: protectedProcedure
    .input(routes.getCityStatsPost.inputValidation)
    .mutation(routes.getCityStatsPost.execute),
  getDepartmentStats: protectedProcedure
    .input(routes.getDepartmentStatsQ.inputValidation)
    .query(routes.getDepartmentStatsQ.execute),
  getDepartmentStatsPost: protectedProcedure
    .input(routes.getDepartmentStatsPost.inputValidation)
    .query(routes.getDepartmentStatsPost.execute),
  getRegionStats: protectedProcedure
    .input(routes.getRegionStatsQ.inputValidation)
    .query(routes.getRegionStatsQ.execute),
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
  getMinistereStructure: protectedProcedure
    .input(routes.getMinistereStructureStatsQ.inputValidation)
    .query(routes.getMinistereStructureStatsQ.execute),
  getMinistereCategorie: protectedProcedure
    .input(routes.getMinistereCategorieStatsQ.inputValidation)
    .query(routes.getMinistereCategorieStatsQ.execute),
  getMinistereInterpellation: protectedProcedure
    .input(routes.getMinistereInterpellationStatsQ.inputValidation)
    .query(routes.getMinistereInterpellationStatsQ.execute),
  getMinistereDepartementServiceAc: protectedProcedure
    .input(routes.getMinistereDepartementServiceAcStatsQ.inputValidation)
    .query(routes.getMinistereDepartementServiceAcStatsQ.execute),
  // TODO: Delete if unused
  exportBeneficiaryStats: protectedProcedure
    .input(routes.exportBeneficiaryStatsQuery.inputValidation)
    .query(routes.exportBeneficiaryStatsQuery.execute),
  // TODO: Delete if unused
  exportHelpRequestStats: protectedProcedure
    .input(routes.exportHelpRequestStatsQuery.inputValidation)
    .query(routes.exportHelpRequestStatsQuery.execute),
  // TODO: Delete if unused
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
