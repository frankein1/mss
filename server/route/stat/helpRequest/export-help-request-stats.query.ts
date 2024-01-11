import { StructureType } from '@prisma/client'
import { getRowsFromData } from '../helper/getRowsFromData'
import { createQuery } from '~/server/route'
import { helpRequestStatusLabels } from '~/client/options/helpRequest'
import { ministerLabels } from '~/client/options/ministry'
import { RowType } from '~/types/export'
import {
  getHelpRequestCountQuery,
  getHelpRequestFinancialStatsQuery,
  getHelpRequestFollowupTypesStatsQuery,
  getHelpRequestInstructorOrganizationStatsQuery,
  getHelpRequestMinistreStatsQuery,
  getHelpRequestPrescribingOrganizationStatsQuery,
  getHelpRequestStatusStatsQuery
} from '~/server/query/stats'
import { StatFilterInput, statFilterSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'
import { getPercentage } from '~/utils/stats'
import { getColumnsFromLabels } from '~/utils/export/getColumnsFromLabels'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { StructureRepo } from '~/server/database'

const handler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  const exportData = []

  const helpRequestCount = await getHelpRequestCountQuery(user, input)

  const followupTypesData = await getHelpRequestFollowupTypesStatsQuery(
    user,
    input
  )
  const followupTypesColumns = followupTypesData.map(({ id, name }) => ({
    key: id,
    header: name
  }))
  const followupTypesRows = [
    followupTypesData.reduce((row: RowType, { _count, id }) => {
      if (_count.socialSupports > 0) {
        row[id] = _count.socialSupports.toString()
      }
      return row
    }, {}),
    followupTypesData.reduce((row: RowType, { _count, id }) => {
      if (_count.socialSupports > 0) {
        row[id] = `${getPercentage(_count.socialSupports, helpRequestCount)}%`
      }
      return row
    }, {}),
    [],
    [],
    [`${helpRequestCount} dossiers instruits`]
  ]
  exportData.push({
    name: "Objet d'accompagnement",
    columns: followupTypesColumns,
    rows: followupTypesRows
  })

  const userStructure = await StructureRepo.findUniqueOrThrow(user, {
    where: { id: user.structureId || '' }
  })

  if (userStructure?.type === StructureType.Ministere) {
    const helpRequestMinistreData = await getHelpRequestMinistreStatsQuery(
      user,
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

  const helpRequestStatusData = await getHelpRequestStatusStatsQuery(
    user,
    input
  )
  const helpRequestStatusColumns = getColumnsFromLabels(helpRequestStatusLabels)
  const helpRequestStatusRows = getRowsFromData(
    helpRequestStatusData,
    'status',
    helpRequestCount
  )
  exportData.push({
    name: 'Statuts',
    columns: helpRequestStatusColumns,
    rows: helpRequestStatusRows
  })

  const helpRequestPrescribingOrganizationData =
    await getHelpRequestPrescribingOrganizationStatsQuery(user, input)
  const helpRequestPrescribingOrganizationColumns =
    helpRequestPrescribingOrganizationData.map(
      ({ prescribingOrganizationId, prescribingOrganization }) => ({
        key: prescribingOrganizationId,
        header: prescribingOrganization
      })
    )
  const helpRequestPrescribingOrganizationRows = getRowsFromData(
    helpRequestPrescribingOrganizationData,
    'prescribingOrganizationId',
    helpRequestCount
  )
  exportData.push({
    name: 'Organismes prescripteurs',
    columns: helpRequestPrescribingOrganizationColumns,
    rows: helpRequestPrescribingOrganizationRows
  })

  const helpRequestFinancialData = await getHelpRequestFinancialStatsQuery(
    user,
    input
  )
  const helpRequestFinancialColumns = [
    ...Object.values(helpRequestFinancialData.financialHelpRequestCounts).map(
      ({ key, label }) => ({ key, header: label })
    ),
    {
      key: 'totalAllocatedAmount',
      header: 'Montant total des aides délivrées par la structure'
    },
    ...helpRequestFinancialData.financialHelpRequestAmountByType.map(
      ({ type: { id, name } }) => ({ key: id, header: name })
    )
  ]
  const helpRequestFinancialRow: RowType = {}
  Object.values(helpRequestFinancialData.financialHelpRequestCounts).forEach(
    ({ key, count }) => (helpRequestFinancialRow[key] = count.toString())
  )
  helpRequestFinancialRow.totalAllocatedAmount = `${helpRequestFinancialData.financialHelpRequestTotalAmount.toFixed(
    2
  )}€`
  helpRequestFinancialData.financialHelpRequestAmountByType.forEach(
    ({ type: { id }, allocatedAmount }) =>
      (helpRequestFinancialRow[id] = `${allocatedAmount}€`)
  )
  exportData.push({
    name: 'Aides financières',
    columns: helpRequestFinancialColumns,
    rows: [helpRequestFinancialRow]
  })

  const helpRequestInstructorOrganizationData =
    await getHelpRequestInstructorOrganizationStatsQuery(user, input)
  const helpRequestInstructorOrganizationColumns =
    helpRequestInstructorOrganizationData.map(
      ({ instructorOrganizationId, instructorOrganization }) => ({
        key: instructorOrganizationId,
        header: instructorOrganization
      })
    )
  const helpRequestInstructorOrganizationRows = getRowsFromData(
    helpRequestInstructorOrganizationData,
    'instructorOrganizationId',
    helpRequestCount
  )
  exportData.push({
    name: 'Organismes instructeurs',
    columns: helpRequestInstructorOrganizationColumns,
    rows: helpRequestInstructorOrganizationRows
  })

  return await createExport(user.id, exportData)
}

export const exportHelpRequestStatsQuery = createQuery({
  inputValidation: statFilterSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
