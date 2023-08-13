import { StructureType } from '@prisma/client'
import { ministerLabels } from '~/client/options/ministry'
import { RowType } from '~/types/export'
import { prismaClient } from '~/server/prisma'
import {
  getHelpRequestCountQuery,
  getHelpRequestFollowupTypesStatsQuery,
  getHelpRequestMinistreStatsQuery
} from '~/server/query/stats'
import { StatFilterInput } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'
import { getPercentage } from '~/utils/stats'
import { getColumnsFromLabels } from '~/utils/export/getColumnsFromLabels'
import { getRowsFromData } from '~/utils/export/getRowsFromData'

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

  const userStructure = await prismaClient.structure.findUnique({
    where: { id: user.structureId }
  })

  if (userStructure?.type === StructureType.Ministere) {
    const helpRequestMinistreData = await getHelpRequestMinistreStatsQuery(
      user.structureId,
      input
    )
    const helpRequestMinistreColumns = getColumnsFromLabels(ministerLabels)
    const helpRequestMinistreRows = getRowsFromData(
      helpRequestMinistreData,
      'ministre',
      helpRequestCount
    )
    exportData.push({
      name: 'Ministres',
      columns: helpRequestMinistreColumns,
      rows: helpRequestMinistreRows
    })
  }

  return await createExport(user.id, exportData)
}
