import { StructureType } from '@prisma/client'
import { getRowsFromData } from '../helper/getRowsFromData'
import { createQuery } from '~/server/route'
import {
  socialSupportStatusKeys,
  ministerKeys,
  fileInstructionTypeKeys
} from '~/client/options'
import { RowType } from '~/types/export'
import {
  getHelpRequestCountQuery,
  getHelpRequestFinancialStatsQuery,
  getHelpRequestSubjectsStatsQuery,
  getHelpRequestMinistreStatsQuery,
  getHelpRequestPrescribingOrganizationStatsQuery,
  getHelpRequestStatusStatsQuery,
  getFileInstructionTypeStatsQuery
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
import { getHelpRequestInstructionsStats } from '~/server/query/stats/helpRequest/getHelpRequestInstructionsStats'

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

  // Instruction-type
  const fileInstructionType = await getFileInstructionTypeStatsQuery(
    user,
    input
  )

  const fileInstructionTypeColums = [
    {
      key: 'subject',
      header: ''
    },
    {
      key: 'Number',
      header: 'Nombre'
    },
    {
      key: 'Percent',
      header: 'Pourcentage'
    }
  ]

  const ministerInterpelationRows = fileInstructionType.map(item => {
    return {
      subject: fileInstructionTypeKeys.byKey[item.subject],
      Number: item._count.toString(),
      Percent: `${getPercentage(item._count, helpRequestCount.total)}%`
    }
  })

  exportData.push({
    name: "Thématique d'instruction",
    columns: fileInstructionTypeColums,
    rows: ministerInterpelationRows
  })

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
          `${getPercentage(_count.socialSupports, helpRequestCount.total)}%`
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
      subject: `TOTAL`,
      Number: `${helpRequestCount.total}`,
      Percent: ''
    }
  )
  exportData.push({
    name: "Objet d'accompagnement",
    columns: getTransposedColumns('subject', "Objet d'accompagnement"),
    rows: transposedSubjectRows
  })

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

  // Instructions
  const instructions = await getHelpRequestInstructionsStats(user, input)

  const instructionColumns = [
    {
      key: 'subject',
      header: ''
    },
    {
      key: 'Number',
      header: 'Nombre'
    },
    {
      key: 'Percent',
      header: 'Pourcentage'
    }
  ]

  const instructionsDistributionRows = [
    {
      subject: 'Instructions en externe',
      Number: instructions.fileInstructions.externalStructure._count.toString(),
      Percent: `${getPercentage(instructions.fileInstructions.externalStructure._count, instructions.fileInstructions._count)}%`
    },
    {
      subject: 'Instructions en interne',
      Number: instructions.fileInstructions.internalStructure._count.toString(),
      Percent: `${getPercentage(instructions.fileInstructions.internalStructure._count, instructions.fileInstructions._count)}%`
    }
  ]

  const separationRows = [
    {
      subject: 'RÉPARTITION DES INSTRUCTIONS EXTERNES',
      Number: '',
      Percent: ''
    },
    {
      subject:
        'Pourcentage calculé sur le nombre de dossiers instruits en externe.',
      Number: '',
      Percent: ''
    }
  ]

  const externalInstructionsRow = Object.values(
    instructions.fileInstructions.instructorOrganization
  ).map(item => {
    return {
      subject: item.name,
      Number: item._count.toString(),
      Percent: `${getPercentage(item._count, instructions.fileInstructions._count)}%`
    }
  })

  exportData.push({
    name: 'Instructions',
    columns: instructionColumns,
    rows: [
      ...instructionsDistributionRows,
      ...separationRows,
      ...externalInstructionsRow
    ]
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
