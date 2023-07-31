import { getStatLabel } from '~/client/options/stat'
import { STATS_NULL_KEY } from '~/utils/constants/stats'

export function getColumnsFromLabels(labels: Record<string, string>) {
  return [...Object.keys(labels), STATS_NULL_KEY].map(key => ({
    key,
    header: getStatLabel(labels, key)
  }))
}
