import { followupMediumLabels } from '~/client/options/followup'
import { RowType } from '~/types/export'
import {
  getFollowupCountQuery,
  getFollowupFollowupTypesStatsQuery,
  getFollowupMediumStatsQuery
} from '~/server/query/stats'
import { StatFilterInput } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'
import { getPercentage } from '~/utils/stats'
import { getColumnsFromLabels } from '~/utils/export/getColumnsFromLabels'
import { getRowsFromData } from '~/utils/export/getRowsFromData'

export const exportFollowupStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  const exportData = []

  const followupCount = await getFollowupCountQuery(user.structureId, input)

  const followupTypesData = await getFollowupFollowupTypesStatsQuery(
    user.structureId,
    input
  )
  const followupTypesColumns = followupTypesData.map(({ id, name }) => ({
    key: id,
    header: name
  }))
  const followupTypesRows = [
    followupTypesData.reduce((row: RowType, { _count, id }) => {
      if (_count.followups > 0) {
        row[id] = _count.followups.toString()
      }
      return row
    }, {}),
    followupTypesData.reduce((row: RowType, { _count, id }) => {
      if (_count.followups > 0) {
        row[id] = `${getPercentage(_count.followups, followupCount)}%`
      }
      return row
    }, {})
  ]
  exportData.push({
    name: 'Objets des entretiens',
    columns: followupTypesColumns,
    rows: followupTypesRows
  })

  const followupMediumData = await getFollowupMediumStatsQuery(
    user.structureId,
    input
  )
  const followupMediumColumns = getColumnsFromLabels(followupMediumLabels)
  const followupMediumRows = getRowsFromData(
    followupMediumData,
    'medium',
    followupCount
  )
  exportData.push({
    name: "Types d'entretiens",
    columns: followupMediumColumns,
    rows: followupMediumRows
  })

  return await createExport(user.id, exportData)
}
