import { statRoutes as routes } from '~/server/route'
import { protectedProcedure, router } from '~/server/trpc'

export const statRouter = router({
  getAccommodationZoneStats: protectedProcedure
    .input(routes.getAccommodationZoneStatsQ.inputValidation)
    .query(routes.getAccommodationZoneStatsQ.execute),
  getAccommodationModeStats: protectedProcedure
    .input(routes.getAccommodationModeStatsQ.inputValidation)
    .query(routes.getAccommodationModeStatsQ.execute),
  getAgeStats: protectedProcedure
    .input(routes.getAgeStatsQ.inputValidation)
    .query(routes.getAgeStatsQ.execute),
  getBeneficiaryCount: protectedProcedure
    .input(routes.getBeneficiaryCountQ.inputValidation)
    .query(routes.getBeneficiaryCountQ.execute),
  getCSPStats: protectedProcedure
    .input(routes.getCSPStatsQ.inputValidation)
    .query(routes.getCSPStatsQ.execute),
  getFamilyStats: protectedProcedure
    .input(routes.getFamilyStatsQ.inputValidation)
    .query(routes.getFamilyStatsQ.execute),
  getFinancialHelpRequestsStats: protectedProcedure
    .input(routes.getFinancialHelpRequestsStatsQ.inputValidation)
    .query(routes.getFinancialHelpRequestsStatsQ.execute),
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
  getHelpRequestMinistreStats: protectedProcedure
    .input(routes.getHelpRequestMinistreStatsQ.inputValidation)
    .query(routes.getHelpRequestMinistreStatsQ.execute),
  getHelpRequestPrescribingOrganizationStats: protectedProcedure
    .input(routes.getHelpRequestPrescribingOrganizationStatsQ.inputValidation)
    .query(routes.getHelpRequestPrescribingOrganizationStatsQ.execute),
  getHelpRequestStatusStats: protectedProcedure
    .input(routes.getHelpRequestStatusStatsQ.inputValidation)
    .query(routes.getHelpRequestStatusStatsQ.execute),
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
  getDepartmentStats: protectedProcedure
    .input(routes.getDepartmentStatsQ.inputValidation)
    .query(routes.getDepartmentStatsQ.execute),
  getRegionStats: protectedProcedure
    .input(routes.getRegionStatsQ.inputValidation)
    .query(routes.getRegionStatsQ.execute),
  getFollowupSubjectStats: protectedProcedure
    .input(routes.getFollowupSubjectsStatsQ.inputValidation)
    .query(routes.getFollowupSubjectsStatsQ.execute),
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
  getInstructorOrganizationStats: protectedProcedure
    .input(routes.getInstructorOrganizationStatsQ.inputValidation)
    .query(routes.getInstructorOrganizationStatsQ.execute),
  exportBeneficiaryStats: protectedProcedure
    .input(routes.exportBeneficiaryStatsQuery.inputValidation)
    .query(routes.exportBeneficiaryStatsQuery.execute),
  exportHelpRequestStats: protectedProcedure
    .input(routes.exportHelpRequestStatsQuery.inputValidation)
    .query(routes.exportHelpRequestStatsQuery.execute),
  exportFollowupStats: protectedProcedure
    .input(routes.exportFollowupStatsQuery.inputValidation)
    .query(routes.exportFollowupStatsQuery.execute),
  getHelpRequestBeneficiaryNumber: protectedProcedure
    .input(routes.getHelpRequestBeneficiaryNumberQ.inputValidation)
    .query(routes.getHelpRequestBeneficiaryNumberQ.execute)
})
