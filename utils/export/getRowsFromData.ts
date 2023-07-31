import { RowType } from '~/types/export'
import { STATS_NULL_KEY } from '~/utils/constants/stats'
import { getPercentage } from '~/utils/stats'

export function getRowsFromData<T extends string>(
  data: (Record<T, string | null> & Record<'_count', number>)[],
  key: T,
  beneficiaryCount: number
) {
  return [
    data.reduce((row: RowType, countData) => {
      row[countData[key] || STATS_NULL_KEY] = countData._count.toString()
      return row
    }, {}),
    data.reduce((row: RowType, countData) => {
      row[countData[key] || STATS_NULL_KEY] = `${getPercentage(
        countData._count,
        beneficiaryCount
      )}%`
      return row
    }, {})
  ]
}
