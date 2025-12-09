import type { Options } from '~/utils/options'

export function labelOrUnprovided(value: string, options: Options) {
  if (!value) {
    return 'Non renseigné'
  }
  return getOptionLabel(options, value)
}

export function getPercentage(count: number, total: number) {
  return total !== 0 ? ((count / total) * 100).toFixed(1) : '-'
}

export const getCustomAgeGroupLabel = (
  fromAge?: number | null,
  toAge?: number | null
) => {
  if (!fromAge && !toAge) {
    return 'Personnalisée'
  }
  if (fromAge === toAge) {
    return `${fromAge} ans`
  }
  if (fromAge == null) {
    return `${toAge} ans et moins`
  }
  if (toAge == null) {
    return `${fromAge} ans et plus`
  }
  return `${fromAge} ans - ${toAge} ans`
}
