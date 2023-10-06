import {
  exportBeneficiaryStatsQuery,
  exportFollowupStatsQuery,
  exportHelpRequestStatsQuery,
  getAccommodationModeStatsQ,
  getAccommodationZoneStatsQ,
  getAgeStatsQ,
  getBeneficiaryCountQ,
  getCSPStatsQ,
  getFamilyStatsQ,
  getFinancialHelpRequestsStatsQ,
  getFollowupActionsEntreprisesStatsQ,
  getFollowupFollowupTypesStatsQ,
  getFollowupMediumStatsQ,
  getFollowupMinistreStatsQ,
  getFollowupPrescribingOrganizationStatsQ,
  getFollowupStatusStatsQ,
  getGenderStatsQ,
  getHelpRequestFollowupTypesStatsQ,
  getHelpRequestMinistreStatsQ,
  getHelpRequestPrescribingOrganizationStatsQ,
  getHelpRequestStatusStatsQ,
  getHistoryCountsQuery,
  getInstructorOrganizationStatsQ,
  getMinistereCategorieStatsQ,
  getMinistereDepartementServiceAcStatsQ,
  getMinistereStructureStatsQ,
  getMobilityStatsQ,
  getRegionStatsQ
} from '~/server/route/stat'
import { protectedProcedure, router } from '~/server/trpc'

export const statRouter = router({
  getAccommodationZoneStats: protectedProcedure
    .input(getAccommodationZoneStatsQ.inputValidation)
    .query(getAccommodationZoneStatsQ.execute),
  getAccommodationModeStats: protectedProcedure
    .input(getAccommodationModeStatsQ.inputValidation)
    .query(getAccommodationModeStatsQ.execute),
  getAgeStats: protectedProcedure
    .input(getAgeStatsQ.inputValidation)
    .query(getAgeStatsQ.execute),
  getBeneficiaryCount: protectedProcedure
    .input(getBeneficiaryCountQ.inputValidation)
    .query(getBeneficiaryCountQ.execute),
  getCSPStats: protectedProcedure
    .input(getCSPStatsQ.inputValidation)
    .query(getCSPStatsQ.execute),
  getFamilyStats: protectedProcedure
    .input(getFamilyStatsQ.inputValidation)
    .query(getFamilyStatsQ.execute),
  getFinancialHelpRequestsStats: protectedProcedure
    .input(getFinancialHelpRequestsStatsQ.inputValidation)
    .query(getFinancialHelpRequestsStatsQ.execute),
  getFollowupActionsEntreprisesStats: protectedProcedure
    .input(getFollowupActionsEntreprisesStatsQ.inputValidation)
    .query(getFollowupActionsEntreprisesStatsQ.execute),
  getFollowupMediumStats: protectedProcedure
    .input(getFollowupMediumStatsQ.inputValidation)
    .query(getFollowupMediumStatsQ.execute),
  getFollowupMinistreStats: protectedProcedure
    .input(getFollowupMinistreStatsQ.inputValidation)
    .query(getFollowupMinistreStatsQ.execute),
  getFollowupPrescribingOrganizationStats: protectedProcedure
    .input(getFollowupPrescribingOrganizationStatsQ.inputValidation)
    .query(getFollowupPrescribingOrganizationStatsQ.execute),
  getFollowupStatusStats: protectedProcedure
    .input(getFollowupStatusStatsQ.inputValidation)
    .query(getFollowupStatusStatsQ.execute),
  getGenderStats: protectedProcedure
    .input(getGenderStatsQ.inputValidation)
    .query(getGenderStatsQ.execute),
  getHelpRequestMinistreStats: protectedProcedure
    .input(getHelpRequestMinistreStatsQ.inputValidation)
    .query(getHelpRequestMinistreStatsQ.execute),
  getHelpRequestPrescribingOrganizationStats: protectedProcedure
    .input(getHelpRequestPrescribingOrganizationStatsQ.inputValidation)
    .query(getHelpRequestPrescribingOrganizationStatsQ.execute),
  getHelpRequestStatusStats: protectedProcedure
    .input(getHelpRequestStatusStatsQ.inputValidation)
    .query(getHelpRequestStatusStatsQ.execute),
  getHistoryCounts: protectedProcedure
    .input(getHistoryCountsQuery.inputValidation)
    .query(getHistoryCountsQuery.execute),
  getMobilityStats: protectedProcedure
    .input(getMobilityStatsQ.inputValidation)
    .query(getMobilityStatsQ.execute),
  getRegionStats: protectedProcedure
    .input(getRegionStatsQ.inputValidation)
    .query(getRegionStatsQ.execute),
  getFollowupFollowupTypeStats: protectedProcedure
    .input(getFollowupFollowupTypesStatsQ.inputValidation)
    .query(getFollowupFollowupTypesStatsQ.execute),
  getHelpRequestFollowupTypeStats: protectedProcedure
    .input(getHelpRequestFollowupTypesStatsQ.inputValidation)
    .query(getHelpRequestFollowupTypesStatsQ.execute),
  getMinistereStructure: protectedProcedure
    .input(getMinistereStructureStatsQ.inputValidation)
    .query(getMinistereStructureStatsQ.execute),
  getMinistereCategorie: protectedProcedure
    .input(getMinistereCategorieStatsQ.inputValidation)
    .query(getMinistereCategorieStatsQ.execute),
  getMinistereDepartementServiceAc: protectedProcedure
    .input(getMinistereDepartementServiceAcStatsQ.inputValidation)
    .query(getMinistereDepartementServiceAcStatsQ.execute),
  getInstructorOrganizationStats: protectedProcedure
    .input(getInstructorOrganizationStatsQ.inputValidation)
    .query(getInstructorOrganizationStatsQ.execute),
  exportBeneficiaryStats: protectedProcedure
    .input(exportBeneficiaryStatsQuery.inputValidation)
    .query(exportBeneficiaryStatsQuery.execute),
  exportHelpRequestStats: protectedProcedure
    .input(exportHelpRequestStatsQuery.inputValidation)
    .query(exportHelpRequestStatsQuery.execute),
  exportFollowupStats: protectedProcedure
    .input(exportFollowupStatsQuery.inputValidation)
    .query(exportFollowupStatsQuery.execute)
})
