import type { Options } from '~/utils/options'

export function labelOrUnprovided(value: string, options: Options) {
  if (!value) {
    return 'Non renseigné'
  }
  return findOptionLabel(options, value)
}

export function getPercentage(count: number, total: number) {
  return ((count / total) * 100).toFixed(1)
}
