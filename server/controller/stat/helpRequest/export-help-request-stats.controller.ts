import { RowType } from '~/types/export'
import {
  getHelpRequestCountQuery,
  getHelpRequestFollowupTypesStatsQuery
} from '~/server/query/stats'
import { StatFilterInput } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'
import { getPercentage } from '~/utils/stats'

export const exportHelpRequestStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  const exportData = []

  const helpRequestCount = await getHelpRequestCountQuery(
    user.structureId,
    input
  )

  const followupTypesData = await getHelpRequestFollowupTypesStatsQuery(
    user.structureId,
    input
  )
  const followupTypesColumns = followupTypesData.map(({ id, name }) => ({
    key: id,
    header: name
  }))
  const followupTypesRows = [
    followupTypesData.reduce((row: RowType, { _count, id }) => {
      if (_count.helpRequests > 0) {
        row[id] = _count.helpRequests.toString()
      }
      return row
    }, {}),
    followupTypesData.reduce((row: RowType, { _count, id }) => {
      if (_count.helpRequests > 0) {
        row[id] = `${getPercentage(_count.helpRequests, helpRequestCount)}%`
      }
      return row
    }, {})
  ]
  exportData.push({
    name: "Objets des demandes d'aide",
    columns: followupTypesColumns,
    rows: followupTypesRows
  })

  return await createExport(user.id, exportData)
}
