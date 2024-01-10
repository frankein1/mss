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
