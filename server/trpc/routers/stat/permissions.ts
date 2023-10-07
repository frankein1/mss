import { rule } from 'trpc-shield'
import { canViewStats } from '~/server/security/rules'
import { ProtectedAppContext } from '~/server/trpc'

const canViewStatsRule = rule<ProtectedAppContext>()(ctx => {
  const user = ctx.user
  return canViewStats(user)
})

export const statPermissions = {
  query: {
    getAccommodationZoneStats: canViewStatsRule,
    getAccommodationModeStats: canViewStatsRule,
    getAgeStats: canViewStatsRule,
    getBeneficiaryCount: canViewStatsRule,
    getCSPStats: canViewStatsRule,
    getFamilyStats: canViewStatsRule,
    getFinancialHelpRequestsStats: canViewStatsRule,
    getFollowupActionsEntreprisesStats: canViewStatsRule,
    getFollowupMediumStats: canViewStatsRule,
    getFollowupMinistreStats: canViewStatsRule,
    getFollowupPrescribingOrganizationStats: canViewStatsRule,
    getFollowupStatusStats: canViewStatsRule,
    getGenderStats: canViewStatsRule,
    getHelpRequestMinistreStats: canViewStatsRule,
    getHelpRequestPrescribingOrganizationStats: canViewStatsRule,
    getHelpRequestStatusStats: canViewStatsRule,
    getHistoryCounts: canViewStatsRule,
    getMobilityStats: canViewStatsRule,
    getRegionStats: canViewStatsRule,
    getFollowupFollowupTypeStats: canViewStatsRule,
    getHelpRequestFollowupTypeStats: canViewStatsRule,
    getMinistereStructure: canViewStatsRule,
    getMinistereCategorie: canViewStatsRule,
    getMinistereDepartementServiceAc: canViewStatsRule,
    getInstructorOrganizationStats: canViewStatsRule,
    exportBeneficiaryStats: canViewStatsRule,
    exportHelpRequestStats: canViewStatsRule,
    exportFollowupStats: canViewStatsRule
  },
  mutation: {}
}
