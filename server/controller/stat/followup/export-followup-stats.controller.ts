import { StructureType } from '@prisma/client'
import {
  followupMediumLabels,
  followupStatusLabels
} from '~/client/options/followup'
import { ministerLabels } from '~/client/options/ministry'
import { RowType } from '~/types/export'
import { prismaClient } from '~/server/prisma'
import {
  getFollowupActionsEntreprisesStatsQuery,
  getFollowupCountQuery,
  getFollowupFollowupTypesStatsQuery,
  getFollowupMediumStatsQuery,
  getFollowupMinistreStatsQuery,
  getFollowupPrescribingOrganizationStatsQuery,
  getFollowupStatusStatsQuery
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

  const userStructure = await prismaClient.structure.findUnique({
    where: { id: user.structureId }
  })

  if (userStructure?.type === StructureType.Ministere) {
    const followupMinistreData = await getFollowupMinistreStatsQuery(
      user.structureId,
      input
    )
    const followupMinistreColumns = getColumnsFromLabels(ministerLabels)
    const followupMinistreRows = getRowsFromData(
      followupMinistreData,
      'ministre',
      followupCount
    )
    exportData.push({
      name: 'Ministres',
      columns: followupMinistreColumns,
      rows: followupMinistreRows
    })
  }

  const followupStatusData = await getFollowupStatusStatsQuery(
    user.structureId,
    input
  )
  const followupStatusColumns = getColumnsFromLabels(followupStatusLabels)
  const followupStatusRows = getRowsFromData(
    followupStatusData,
    'status',
    followupCount
  )
  exportData.push({
    name: 'Statuts',
    columns: followupStatusColumns,
    rows: followupStatusRows
  })

  const followupActionsEntreprisesData =
    await getFollowupActionsEntreprisesStatsQuery(user.structureId, input)
  const followupActionsEntreprisesColumns = followupActionsEntreprisesData.map(
    ({ actionEntrepriseId, actionEntreprise }) => ({
      key: actionEntrepriseId,
      header: actionEntreprise
    })
  )
  const followupActionsEntreprisesRows = getRowsFromData(
    followupActionsEntreprisesData,
    'actionEntrepriseId',
    followupCount
  )
  exportData.push({
    name: 'Actions entreprises',
    columns: followupActionsEntreprisesColumns,
    rows: followupActionsEntreprisesRows
  })

  const followupPrescribingOrganizationData =
    await getFollowupPrescribingOrganizationStatsQuery(user.structureId, input)
  const followupPrescribingOrganizationColumns =
    followupPrescribingOrganizationData.map(
      ({ prescribingOrganizationId, prescribingOrganization }) => ({
        key: prescribingOrganizationId,
        header: prescribingOrganization
      })
    )
  const followupPrescribingOrganizationRows = getRowsFromData(
    followupPrescribingOrganizationData,
    'prescribingOrganizationId',
    followupCount
  )
  exportData.push({
    name: 'Organismes prescripteurs',
    columns: followupPrescribingOrganizationColumns,
    rows: followupPrescribingOrganizationRows
  })

  return await createExport(user.id, exportData)
}
