import { StructureType } from '@prisma/client'
import { getRowsFromData } from '../helper/getRowsFromData'
import { createQuery } from '~/server/route'
import {
  followupMediumLabels,
  followupStatusLabels
} from '~/client/options/followup'
import { ministerLabels } from '~/client/options/ministry'
import { RowType, WorksheetType } from '~/types/export'
import {
  getFollowupActionsEntreprisesStatsQuery,
  getFollowupCountQuery,
  getFollowupFollowupTypesStatsQuery,
  getFollowupMediumStatsQuery,
  getFollowupMinistreStatsQuery,
  getFollowupPrescribingOrganizationStatsQuery,
  getFollowupStatusStatsQuery
} from '~/server/query/stats'
import { StatFilterInput, statFilterSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'
import { getPercentage } from '~/utils/stats'
import { getColumnsFromLabels } from '~/utils/export/getColumnsFromLabels'
import { AllowSecurityCheck } from '~/server/security'
import { StructureRepo } from '~/server/database'

const handler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  const exportData: WorksheetType[] = []

  const followupCount = await getFollowupCountQuery(user, input)

  const followupTypesData = await getFollowupFollowupTypesStatsQuery(
    user,
    input
  )
  const followupTypesColumns = followupTypesData.map(({ id, name }) => ({
    key: id,
    header: name
  }))
  followupTypesColumns.push({ key: 'total', header: 'Total' })

  const followupTypeCountTotal = followupTypesData
    .reduce((total, { _count }) => total + _count.followups, 0)
    .toString()

  const followupTypesRows = [
    followupTypesData.reduce(
      (row: RowType, { _count, id }) => {
        if (_count.followups > 0) {
          row[id] = _count.followups.toString()
        }
        return row
      },
      { total: followupTypeCountTotal }
    ),
    followupTypesData.reduce(
      (row: RowType, { _count, id }) => {
        if (_count.followups > 0) {
          row[id] = `${getPercentage(_count.followups, followupCount)}%`
        }
        return row
      },
      { total: '100%' }
    ),
    [],
    [],
    [`${followupCount} entretiens menés`]
  ]
  exportData.push({
    name: 'Objets des entretiens',
    columns: followupTypesColumns,
    rows: followupTypesRows
  })

  const followupMediumData = await getFollowupMediumStatsQuery(user, input)
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

  const userStructure = await StructureRepo.findUniqueOrThrow(user, {
    where: { id: user.structureId || '' }
  })

  if (userStructure?.type === StructureType.Ministere) {
    const followupMinistreData = await getFollowupMinistreStatsQuery(
      user,
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

  const followupStatusData = await getFollowupStatusStatsQuery(user, input)
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
    await getFollowupActionsEntreprisesStatsQuery(user, input)
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
    await getFollowupPrescribingOrganizationStatsQuery(user, input)
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

export const exportFollowupStatsQuery = createQuery({
  inputValidation: statFilterSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
