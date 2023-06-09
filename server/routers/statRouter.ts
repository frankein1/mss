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
  getSupportStatsHandler,
  getAccommodationZoneStatsHandler,
  getMinistereStructureStatsHandler,
  getMinistereCategorieStatsHandler
} from '~/server/controller/stat'
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
  getSupportStats: protectedProcedure
    .input(statFilterSchema)
    .query(getSupportStatsHandler),
  getMinistereStructure: protectedProcedure
    .input(statFilterSchema)
    .query(getMinistereStructureStatsHandler),
  getMinistereCategorie: protectedProcedure
    .input(statFilterSchema)
    .query(getMinistereCategorieStatsHandler)
})
