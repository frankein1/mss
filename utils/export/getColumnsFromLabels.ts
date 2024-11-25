import { getStatLabel } from '~/client/options'
import { STATS_NULL_KEY } from '~/utils/constants/stats'

export function getColumnsFromLabels(labels: Record<string, string>) {
  return [...Object.keys(labels), STATS_NULL_KEY].map(key => ({
    key,
    header: getStatLabel(labels, key)
  }))
}

export const getColumns = (header: string) => {
  return [
    {
      key: 'label',
      header: header
    },
    {
      key: 'number',
      header: 'Nombre'
    },
    {
      key: 'percent',
      header: 'Pourcentage'
    }
  ]
}
