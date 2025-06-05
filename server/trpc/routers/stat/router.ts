import { statRoutes as routes } from '~/server/route'
import { protectedProcedure, router } from '~/server/trpc'

/** All routes in stat router use trpc mutations in order to deal with complex filters */
export const statRouter = router({
  getAccommodationZoneStats: protectedProcedure
    .input(routes.getAccommodationZoneStatsQ.inputValidation)
    .mutation(routes.getAccommodationZoneStatsQ.execute),
  getAccommodationModeStats: protectedProcedure
    .input(routes.getAccommodationModeStatsQ.inputValidation)
    .mutation(routes.getAccommodationModeStatsQ.execute),
  getAgeStats: protectedProcedure
    .input(routes.getAgeStatsQ.inputValidation)
    .mutation(routes.getAgeStatsQ.execute),
  getBeneficiaryCount: protectedProcedure
    .input(routes.getBeneficiaryCountQ.inputValidation)
    .mutation(routes.getBeneficiaryCountQ.execute),
  getFamilyFileCount: protectedProcedure
    .input(routes.getFamilyFileCountQ.inputValidation)
    .mutation(routes.getFamilyFileCountQ.execute),
  getCSPStats: protectedProcedure
    .input(routes.getCSPStatsQ.inputValidation)
    .mutation(routes.getCSPStatsQ.execute),
  getFamilyStats: protectedProcedure
    .input(routes.getFamilyStatsQ.inputValidation)
    .mutation(routes.getFamilyStatsQ.execute),
  getHousingHelpRequestsStats: protectedProcedure
    .input(routes.getHousingHelpRequestsStatsQ.inputValidation)
    .mutation(routes.getHousingHelpRequestsStatsQ.execute),
  getFollowupActionsEntreprisesStats: protectedProcedure
    .input(routes.getFollowupActionsEntreprisesStatsQ.inputValidation)
    .mutation(routes.getFollowupActionsEntreprisesStatsQ.execute),
  getFollowupMediumStats: protectedProcedure
    .input(routes.getFollowupMediumStatsQ.inputValidation)
    .mutation(routes.getFollowupMediumStatsQ.execute),
  getFollowupMinistreStats: protectedProcedure
    .input(routes.getFollowupMinistreStatsQ.inputValidation)
    .mutation(routes.getFollowupMinistreStatsQ.execute),
  getFollowupPrescribingOrganizationStats: protectedProcedure
    .input(routes.getFollowupPrescribingOrganizationStatsQ.inputValidation)
    .mutation(routes.getFollowupPrescribingOrganizationStatsQ.execute),
  getFollowupStatusStats: protectedProcedure
    .input(routes.getFollowupStatusStatsQ.inputValidation)
    .mutation(routes.getFollowupStatusStatsQ.execute),
  getGenderStats: protectedProcedure
    .input(routes.getGenderStatsQ.inputValidation)
    .mutation(routes.getGenderStatsQ.execute),
  getHelpRequestMinistreStats: protectedProcedure
    .input(routes.getHelpRequestMinistreStatsQ.inputValidation)
    .mutation(routes.getHelpRequestMinistreStatsQ.execute),
  getHelpRequestPrescribingOrganizationStats: protectedProcedure
    .input(routes.getHelpRequestPrescribingOrganizationStatsQ.inputValidation)
    .mutation(routes.getHelpRequestPrescribingOrganizationStatsQ.execute),
  getHelpRequestAmountsBySubject: protectedProcedure
    .input(routes.getHelpRequestAmountsBySubjectQ.inputValidation)
    .mutation(routes.getHelpRequestAmountsBySubjectQ.execute),
  getHelpRequestInstructionsStats: protectedProcedure
    .input(routes.getHelpRequestInstructionsStatsQ.inputValidation)
    .mutation(routes.getHelpRequestInstructionsStatsQ.execute),
  getHelpRequestStatusStats: protectedProcedure
    .input(routes.getHelpRequestStatusStatsQ.inputValidation)
    .mutation(routes.getHelpRequestStatusStatsQ.execute),
  getHelpRequestAmountsByInstructorOrganization: protectedProcedure
    .input(
      routes.getHelpRequestAmountsByInstructorOrganizationQ.inputValidation
    )
    .mutation(routes.getHelpRequestAmountsByInstructorOrganizationQ.execute),
  getHelpRequestAmountsAllocated: protectedProcedure
    .input(routes.getHelpRequestAmountsAllocatedQ.inputValidation)
    .mutation(routes.getHelpRequestAmountsAllocatedQ.execute),
  getFileInstructionTypeStats: protectedProcedure
    .input(routes.getFileInstructionTypeStatsQ.inputValidation)
    .mutation(routes.getFileInstructionTypeStatsQ.execute),
  getHistoryCounts: protectedProcedure
    .input(routes.getHistoryCountsQuery.inputValidation)
    .mutation(routes.getHistoryCountsQuery.execute),
  getMobilityStats: protectedProcedure
    .input(routes.getMobilityStatsQ.inputValidation)
    .mutation(routes.getMobilityStatsQ.execute),
  getCityStats: protectedProcedure
    .input(routes.getCityStatsQ.inputValidation)
    .mutation(routes.getCityStatsQ.execute),
  getDepartmentStats: protectedProcedure
    .input(routes.getDepartmentStatsQ.inputValidation)
    .mutation(routes.getDepartmentStatsQ.execute),
  getRegionStats: protectedProcedure
    .input(routes.getRegionStatsQ.inputValidation)
    .mutation(routes.getRegionStatsQ.execute),
  getFollowupSubjectStats: protectedProcedure
    .input(routes.getFollowupSubjectsStatsQ.inputValidation)
    .mutation(routes.getFollowupSubjectsStatsQ.execute),
  getFollowupDurationStats: protectedProcedure
    .input(routes.getFollowupDurationStatsQ.inputValidation)
    .mutation(routes.getFollowupDurationStatsQ.execute),
  getFollowupMeanTimeStats: protectedProcedure
    .input(routes.getFollowupMeanTimeStatsQ.inputValidation)
    .mutation(routes.getFollowupMeanTimeStatsQ.execute),
  getHelpRequestSubjectStats: protectedProcedure
    .input(routes.getHelpRequestSubjectsStatsQ.inputValidation)
    .mutation(routes.getHelpRequestSubjectsStatsQ.execute),
  getMinistereStructure: protectedProcedure
    .input(routes.getMinistereStructureStatsQ.inputValidation)
    .mutation(routes.getMinistereStructureStatsQ.execute),
  getMinistereCategorie: protectedProcedure
    .input(routes.getMinistereCategorieStatsQ.inputValidation)
    .mutation(routes.getMinistereCategorieStatsQ.execute),
  getMinistereInterpellation: protectedProcedure
    .input(routes.getMinistereInterpellationStatsQ.inputValidation)
    .mutation(routes.getMinistereInterpellationStatsQ.execute),
  getMinistereDepartementServiceAc: protectedProcedure
    .input(routes.getMinistereDepartementServiceAcStatsQ.inputValidation)
    .mutation(routes.getMinistereDepartementServiceAcStatsQ.execute),
  // TODO: Delete if unused
  exportBeneficiaryStats: protectedProcedure
    .input(routes.exportBeneficiaryStatsQuery.inputValidation)
    .mutation(routes.exportBeneficiaryStatsQuery.execute),
  // TODO: Delete if unused
  exportHelpRequestStats: protectedProcedure
    .input(routes.exportHelpRequestStatsQuery.inputValidation)
    .mutation(routes.exportHelpRequestStatsQuery.execute),
  // TODO: Delete if unused
  exportFollowupStats: protectedProcedure
    .input(routes.exportFollowupStatsQuery.inputValidation)
    .mutation(routes.exportFollowupStatsQuery.execute),
  getHelpRequestBeneficiaryNumber: protectedProcedure
    .input(routes.getHelpRequestBeneficiaryNumberQ.inputValidation)
    .mutation(routes.getHelpRequestBeneficiaryNumberQ.execute),
  getFollowupBeneficiaryNumber: protectedProcedure
    .input(routes.getFollowupBeneficiaryNumberQ.inputValidation)
    .mutation(routes.getFollowupBeneficiaryNumberQ.execute)
})
