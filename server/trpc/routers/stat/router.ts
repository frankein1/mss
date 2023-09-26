import {
  getAccommodationModeStatsHandler,
  getAgeStatsHandler,
  getBeneficiaryCountHandler,
  getCSPStatsHandler,
  getFamilyStatsHandler,
  getFinancialHelpRequestsStats,
  getFollowupActionsEntreprisesStatsHandler,
  getFollowupMediumStatsHandler,
  getFollowupMinistreStatsHandler,
  getFollowupPrescribingOrganizationStatsHandler,
  getFollowupStatusStatsHandler,
  getGenderStatsHandler,
  getHelpRequestMinistreStatsHandler,
  getHelpRequestPrescribingOrganizationStatsHandler,
  getHelpRequestStatusStatsHandler,
  getHistoryCountsHandler,
  getMobilityStatsHandler,
  getRegionStatsHandler,
  getFollowupFollowupTypesStatsHandler,
  getAccommodationZoneStatsHandler,
  getMinistereStructureStatsHandler,
  getMinistereCategorieStatsHandler,
  getMinistereDepartementServiceAcStatsHandler,
  getInstructorOrganizationStatsHandler,
  getHelpRequestFollowupTypesStatsHandler,
  exportBeneficiaryStatsHandler,
  exportHelpRequestStatsHandler,
  exportFollowupStatsHandler
} from '~/server/trpc/controller/stat'
import { statFilterSchema } from '~/server/schema'
import { protectedProcedure, router } from '~/server/trpc'

export const statRouter = router({
  getAccommodationZoneStats: protectedProcedure
    .input(statFilterSchema)
    .query(getAccommodationZoneStatsHandler),
  getAccommodationModeStats: protectedProcedure
    .input(statFilterSchema)
    .query(getAccommodationModeStatsHandler),
  getAgeStats: protectedProcedure
    .input(statFilterSchema)
    .query(getAgeStatsHandler),
  getBeneficiaryCount: protectedProcedure
    .input(statFilterSchema)
    .query(getBeneficiaryCountHandler),
  getCSPStats: protectedProcedure
    .input(statFilterSchema)
    .query(getCSPStatsHandler),
  getFamilyStats: protectedProcedure
    .input(statFilterSchema)
    .query(getFamilyStatsHandler),
  getFinancialHelpRequestsStats: protectedProcedure
    .input(statFilterSchema)
    .query(getFinancialHelpRequestsStats),
  getFollowupActionsEntreprisesStats: protectedProcedure
    .input(statFilterSchema)
    .query(getFollowupActionsEntreprisesStatsHandler),
  getFollowupMediumStats: protectedProcedure
    .input(statFilterSchema)
    .query(getFollowupMediumStatsHandler),
  getFollowupMinistreStats: protectedProcedure
    .input(statFilterSchema)
    .query(getFollowupMinistreStatsHandler),
  getFollowupPrescribingOrganizationStats: protectedProcedure
    .input(statFilterSchema)
    .query(getFollowupPrescribingOrganizationStatsHandler),
  getFollowupStatusStats: protectedProcedure
    .input(statFilterSchema)
    .query(getFollowupStatusStatsHandler),
  getGenderStats: protectedProcedure
    .input(statFilterSchema)
    .query(getGenderStatsHandler),
  getHelpRequestMinistreStats: protectedProcedure
    .input(statFilterSchema)
    .query(getHelpRequestMinistreStatsHandler),
  getHelpRequestPrescribingOrganizationStats: protectedProcedure
    .input(statFilterSchema)
    .query(getHelpRequestPrescribingOrganizationStatsHandler),
  getHelpRequestStatusStats: protectedProcedure
    .input(statFilterSchema)
    .query(getHelpRequestStatusStatsHandler),
  getHistoryCounts: protectedProcedure
    .input(statFilterSchema)
    .query(getHistoryCountsHandler),
  getMobilityStats: protectedProcedure
    .input(statFilterSchema)
    .query(getMobilityStatsHandler),
  getRegionStats: protectedProcedure
    .input(statFilterSchema)
    .query(getRegionStatsHandler),
  getFollowupFollowupTypeStats: protectedProcedure
    .input(statFilterSchema)
    .query(getFollowupFollowupTypesStatsHandler),
  getHelpRequestFollowupTypeStats: protectedProcedure
    .input(statFilterSchema)
    .query(getHelpRequestFollowupTypesStatsHandler),
  getMinistereStructure: protectedProcedure
    .input(statFilterSchema)
    .query(getMinistereStructureStatsHandler),
  getMinistereCategorie: protectedProcedure
    .input(statFilterSchema)
    .query(getMinistereCategorieStatsHandler),
  getMinistereDepartementServiceAc: protectedProcedure
    .input(statFilterSchema)
    .query(getMinistereDepartementServiceAcStatsHandler),
  getInstructorOrganizationStats: protectedProcedure
    .input(statFilterSchema)
    .query(getInstructorOrganizationStatsHandler),
  exportBeneficiaryStats: protectedProcedure
    .input(statFilterSchema)
    .query(exportBeneficiaryStatsHandler),
  exportHelpRequestStats: protectedProcedure
    .input(statFilterSchema)
    .query(exportHelpRequestStatsHandler),
  exportFollowupStats: protectedProcedure
    .input(statFilterSchema)
    .query(exportFollowupStatsHandler)
})
