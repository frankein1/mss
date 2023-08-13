import { STATS_NULL_LABEL } from '~/client/options/stat'
import { STATS_NULL_KEY } from '~/utils/constants/stats'
import type { Options } from '~/utils/options'

export function labelOrUnprovided(value: string, options: Options) {
  if (!value) {
    return 'Non renseigné'
  }
  return options.get(value)
}

export function getPercentage(count: number, total: number) {
  return ((count / total) * 100).toFixed(1)
}

export function preparePrescribingOrganizationStats(
  historyItems: {
    prescribingOrganization: { id: string; name: string } | null
  }[]
) {
  const prescribingOrganizationStats = historyItems.reduce(
    (
      prescribingOrganizations: {
        [k: string]: {
          prescribingOrganizationId: string
          prescribingOrganization: string
          _count: number
        }
      },
      historyItem
    ) => {
      const prescribingOrganizationId =
        historyItem.prescribingOrganization?.id || STATS_NULL_KEY
      if (prescribingOrganizationId in prescribingOrganizations) {
        prescribingOrganizations[prescribingOrganizationId]._count++
      } else {
        prescribingOrganizations[prescribingOrganizationId] = {
          prescribingOrganizationId,
          prescribingOrganization:
            historyItem.prescribingOrganization?.name || STATS_NULL_LABEL,
          _count: 1
        }
      }
      return prescribingOrganizations
    },
    {}
  )
  const prescribingOrganizationStatsValues = Object.values(
    prescribingOrganizationStats
  )
  prescribingOrganizationStatsValues.sort((a, b) => b._count - a._count)
  return prescribingOrganizationStatsValues
}
