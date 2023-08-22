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
} from '~/server/controller/stat'
import { statFilterSchema } from '~/server/schema'
import { statsProcedure, router } from '~/server/trpc'

export const statRouter = router({
  getAccommodationZoneStats: statsProcedure
    .input(statFilterSchema)
    .query(getAccommodationZoneStatsHandler),
  getAccommodationModeStats: statsProcedure
    .input(statFilterSchema)
    .query(getAccommodationModeStatsHandler),
  getAgeStats: statsProcedure.input(statFilterSchema).query(getAgeStatsHandler),
  getBeneficiaryCount: statsProcedure
    .input(statFilterSchema)
    .query(getBeneficiaryCountHandler),
  getCSPStats: statsProcedure.input(statFilterSchema).query(getCSPStatsHandler),
  getFamilyStats: statsProcedure
    .input(statFilterSchema)
    .query(getFamilyStatsHandler),
  getFinancialHelpRequestsStats: statsProcedure
    .input(statFilterSchema)
    .query(getFinancialHelpRequestsStats),
  getFollowupActionsEntreprisesStats: statsProcedure
    .input(statFilterSchema)
    .query(getFollowupActionsEntreprisesStatsHandler),
  getFollowupMediumStats: statsProcedure
    .input(statFilterSchema)
    .query(getFollowupMediumStatsHandler),
  getFollowupMinistreStats: statsProcedure
    .input(statFilterSchema)
    .query(getFollowupMinistreStatsHandler),
  getFollowupPrescribingOrganizationStats: statsProcedure
    .input(statFilterSchema)
    .query(getFollowupPrescribingOrganizationStatsHandler),
  getFollowupStatusStats: statsProcedure
    .input(statFilterSchema)
    .query(getFollowupStatusStatsHandler),
  getGenderStats: statsProcedure
    .input(statFilterSchema)
    .query(getGenderStatsHandler),
  getHelpRequestMinistreStats: statsProcedure
    .input(statFilterSchema)
    .query(getHelpRequestMinistreStatsHandler),
  getHelpRequestPrescribingOrganizationStats: statsProcedure
    .input(statFilterSchema)
    .query(getHelpRequestPrescribingOrganizationStatsHandler),
  getHelpRequestStatusStats: statsProcedure
    .input(statFilterSchema)
    .query(getHelpRequestStatusStatsHandler),
  getHistoryCounts: statsProcedure
    .input(statFilterSchema)
    .query(getHistoryCountsHandler),
  getMobilityStats: statsProcedure
    .input(statFilterSchema)
    .query(getMobilityStatsHandler),
  getRegionStats: statsProcedure
    .input(statFilterSchema)
    .query(getRegionStatsHandler),
  getFollowupFollowupTypeStats: statsProcedure
    .input(statFilterSchema)
    .query(getFollowupFollowupTypesStatsHandler),
  getHelpRequestFollowupTypeStats: statsProcedure
    .input(statFilterSchema)
    .query(getHelpRequestFollowupTypesStatsHandler),
  getMinistereStructure: statsProcedure
    .input(statFilterSchema)
    .query(getMinistereStructureStatsHandler),
  getMinistereCategorie: statsProcedure
    .input(statFilterSchema)
    .query(getMinistereCategorieStatsHandler),
  getMinistereDepartementServiceAc: statsProcedure
    .input(statFilterSchema)
    .query(getMinistereDepartementServiceAcStatsHandler),
  getInstructorOrganizationStats: statsProcedure
    .input(statFilterSchema)
    .query(getInstructorOrganizationStatsHandler),
  exportBeneficiaryStats: statsProcedure
    .input(statFilterSchema)
    .query(exportBeneficiaryStatsHandler),
  exportHelpRequestStats: statsProcedure
    .input(statFilterSchema)
    .query(exportHelpRequestStatsHandler),
  exportFollowupStats: statsProcedure
    .input(statFilterSchema)
    .query(exportFollowupStatsHandler)
})
