import { StructureType } from '@prisma/client'
import { getRowsFromData } from '../helper/getRowsFromData'
import { createQuery } from '~/server/route'
import { socialSupportStatusKeys, ministerKeys } from '~/client/options'
import { RowType } from '~/types/export'
import {
  getHelpRequestCountQuery,
  getHelpRequestFinancialStatsQuery,
  getHelpRequestSubjectsStatsQuery,
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
  const exportData = []

  const helpRequestCount = await getHelpRequestCountQuery(user, input)

  // Subject
  const subjectsData = await getHelpRequestSubjectsStatsQuery(user, input)
  const subjectsColumns = subjectsData.map(({ id, name }) => ({
    key: id,
    header: name
  }))

  const subjectsRows = [
    subjectsData.reduce((row: RowType, { _count, id }) => {
      if (_count.socialSupports > 0) {
        row[id] = _count.socialSupports.toString()
      }
      return row
    }, {}),
    subjectsData.reduce((row: RowType, { _count, id }) => {
      if (_count.socialSupports > 0) {
        row[id] =
          `${getPercentage(_count.socialSupports, helpRequestCount.Financial + helpRequestCount.Other)}%`
      }
      return row
    }, {})
  ]
  const transposedSubjectRows = transposeRows(
    subjectsColumns,
    subjectsRows,
    'subject'
  )
  transposedSubjectRows.push(
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
      subject: `${helpRequestCount.total} entretiens menés`,
      Number: '',
      Percent: ''
    }
  )
  exportData.push({
    name: "Objet d'accompagnement",
    columns: getTransposedColumns('subject', "Objet d'accompagnement"),
    rows: transposedSubjectRows
  })

  const userStructure = await StructureRepo.findUniqueOrThrow(user, {
    where: { id: user.structureId || '' }
  })

  if (userStructure?.type === StructureType.Ministere) {
    // Ministre
    const helpRequestMinistreData = await getHelpRequestMinistreStatsQuery(
      user,
      input
    )
    const helpRequestMinistreColumns = getColumnsFromLabels(ministerKeys.byKey)
    const helpRequestMinistreRows = getRowsFromData(
      helpRequestMinistreData,
      'ministre',
      helpRequestCount.total
    )
    exportData.push({
      name: 'Ministres',
      columns: getTransposedColumns('ministre', 'Ministres'),
      rows: transposeRows(
        helpRequestMinistreColumns,
        helpRequestMinistreRows,
        'ministre'
      )
    })
  }

  // Status
  const helpRequestStatusData = await getHelpRequestStatusStatsQuery(
    user,
    input
  )
  const helpRequestStatusColumns = getColumnsFromLabels(
    socialSupportStatusKeys.byKey
  )
  const helpRequestStatusRows = getRowsFromData(
    helpRequestStatusData,
    'status',
    helpRequestCount.total
  )
  exportData.push({
    name: 'Statuts',
    columns: getTransposedColumns('status', 'Statuts'),
    rows: transposeRows(
      helpRequestStatusColumns,
      helpRequestStatusRows,
      'status'
    )
  })

  // Help request prescribing organizations
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
    helpRequestCount.Financial + helpRequestCount.Other
  )
  exportData.push({
    name: 'Organismes prescripteurs',
    columns: getTransposedColumns(
      'prescribingOrganizationId',
      'Organismes prescripteurs'
    ),
    rows: transposeRows(
      helpRequestPrescribingOrganizationColumns,
      helpRequestPrescribingOrganizationRows,
      'prescribingOrganizationId'
    )
  })

  // Financial help request
  const helpRequestFinancialData = await getHelpRequestFinancialStatsQuery(
    user,
    input
  )
  const totalInstruction =
    helpRequestFinancialData.financialHelpRequestCounts.find(
      item => item.key === 'total'
    )?.count || 1

  const financialHelpRequestTotalAmount = `${helpRequestFinancialData.financialHelpRequestTotalAmount.toFixed(
    2
  )}€`

  const columns = getTransposedColumns('financial', 'Aide financière')

  const financialRows: RowType[] =
    helpRequestFinancialData.financialHelpRequestCounts.map(item => {
      return {
        financial: item.label,
        Number: item.count.toString(),
        Percent: `${getPercentage(item.count, totalInstruction)}%`
      }
    })

  financialRows.push(
    {
      financial: '',
      Number: '',
      Percent: ''
    },
    {
      financial: '',
      Number: '',
      Percent: ''
    },
    {
      financial: `Montant total des aides délivrées par la structure ${financialHelpRequestTotalAmount}`,
      Number: '',
      Percent: ''
    }
  )

  exportData.push({
    name: 'Aides financières',
    columns: columns,
    rows: financialRows
  })

  return await createExport(user.id, exportData)
}

export const exportHelpRequestStatsQuery = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
