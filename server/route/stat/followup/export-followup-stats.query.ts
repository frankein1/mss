import { StructureType } from '@prisma/client'
import { getRowsFromData } from '../helper/getRowsFromData'
import { createQuery } from '~/server/route'
import {
  followupMediumKeys,
  followupStatusKeys,
  ministerKeys
} from '~/client/options'
import { RowType, WorksheetType } from '~/types/export'
import {
  getFollowupActionsEntreprisesStatsQuery,
  getFollowupCountQuery,
  getFollowupSubjectsStatsQuery,
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
import { StructureRepo } from '~/server/database'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
import {
  getTransposedColumns,
  transposeRows
} from '~/utils/export/transposeRows'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).export.stats

const handler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  const exportData: WorksheetType[] = []

  const followupCount = await getFollowupCountQuery(user, input)

  // Subjects
  const subjectsData = await getFollowupSubjectsStatsQuery(user, input)
  const subjectsColumns = subjectsData.map(({ id, name }) => ({
    key: id,
    header: name
  }))
  subjectsColumns.push({ key: 'total', header: 'Total' })

  const subjectCountTotal = subjectsData
    .reduce((total, { _count }) => total + _count.socialSupports, 0)
    .toString()

  const subjectsRows = [
    subjectsData.reduce(
      (row: RowType, { _count, id }) => {
        if (_count.socialSupports > 0) {
          row[id] = _count.socialSupports.toString()
        }
        return row
      },
      { total: subjectCountTotal }
    ),
    subjectsData.reduce(
      (row: RowType, { _count, id }) => {
        if (_count.socialSupports > 0) {
          row[id] = `${getPercentage(_count.socialSupports, followupCount)}%`
        }
        return row
      },
      { total: '100%' }
    )
  ]

  const transposedSubjecstRows = transposeRows(
    subjectsColumns,
    subjectsRows,
    'subject'
  )
  transposedSubjecstRows.push(
    {
      subject: '',
      Number: '',
      Percent: ''
    },
    {
      subject: '',
      Number: '',
      Percent: ''
    },
    {
      subject: `${followupCount} entretiens menés`,
      Number: '',
      Percent: ''
    }
  )

  exportData.push({
    name: "Objets d'accompagnement",
    columns: getTransposedColumns('subject', "Objets d'accompagnement"),
    rows: transposedSubjecstRows
  })

  // Followup medium
  const followupMediumData = await getFollowupMediumStatsQuery(user, input)
  const followupMediumColumns = getColumnsFromLabels(followupMediumKeys.byKey)
  const followupMediumRows = getRowsFromData(
    followupMediumData,
    'medium',
    followupCount
  )
  exportData.push({
    name: "Types d'entretiens",
    columns: getTransposedColumns('medium', "Types d'entretiens"),
    rows: transposeRows(followupMediumColumns, followupMediumRows, 'medium')
  })

  const userStructure = await StructureRepo.findUniqueOrThrow(user, {
    where: { id: user.structureId || '' }
  })

  if (userStructure?.type === StructureType.Ministere) {
    // Ministre
    const followupMinistreData = await getFollowupMinistreStatsQuery(
      user,
      input
    )
    const followupMinistreColumns = getColumnsFromLabels(ministerKeys.byKey)
    const followupMinistreRows = getRowsFromData(
      followupMinistreData,
      'ministre',
      followupCount
    )
    exportData.push({
      name: 'Ministres',
      columns: getTransposedColumns('ministre', 'Ministres'),
      rows: transposeRows(
        followupMinistreColumns,
        followupMinistreRows,
        'ministre'
      )
    })
  }

  // Status
  const followupStatusData = await getFollowupStatusStatsQuery(user, input)
  const followupStatusColumns = getColumnsFromLabels(followupStatusKeys.byKey)
  const followupStatusRows = getRowsFromData(
    followupStatusData,
    'status',
    followupCount
  )
  exportData.push({
    name: 'Statuts',
    columns: getTransposedColumns('status', 'Statuts'),
    rows: transposeRows(followupStatusColumns, followupStatusRows, 'status')
  })

  // Actions
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
    columns: getTransposedColumns('actionEntrepriseId', 'Actions entreprises'),
    rows: transposeRows(
      followupActionsEntreprisesColumns,
      followupActionsEntreprisesRows,
      'actionEntrepriseId'
    )
  })

  // Prescribing Organizations
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
    columns: getTransposedColumns(
      'prescribingOrganizationId',
      'Organismes prescripteurs'
    ),
    rows: transposeRows(
      followupPrescribingOrganizationColumns,
      followupPrescribingOrganizationRows,
      'prescribingOrganizationId'
    )
  })

  return await createExport(user.id, exportData)
}

export const exportFollowupStatsQuery = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
