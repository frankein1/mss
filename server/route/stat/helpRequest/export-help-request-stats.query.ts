import { StructureType } from '~/prisma/generated/client'
import { createQuery } from '~/server/route'
import {
  socialSupportStatusKeys,
  fileInstructionTypeKeys
} from '~/client/options'
import {
  getHelpRequestCountQuery,
  getHelpRequestSubjectsStatsQuery,
  getHelpRequestMinistreStatsQuery,
  getHelpRequestPrescribingOrganizationStatsQuery,
  getHelpRequestStatusStatsQuery,
  getFileInstructionTypeStatsQuery,
  getHelpRequestAmountsAllocatedQuery,
  getHelpRequestAmountsByInstructorOrganizationQuery,
  getHelpRequestAmountsBySubjectQuery,
  getHelpRequestHousingStatsQuery
} from '~/server/query/stats'
import type { StatFilterInput } from '~/server/schema'
import { statFilterSchema } from '~/server/schema'
import type { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'
import { getPercentage } from '~/utils/stats'
import { getColumns } from '~/utils/export/getColumns'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { getHelpRequestInstructionsStats } from '~/server/query/stats/helpRequest/getHelpRequestInstructionsStats'
import type { WorksheetType } from '~/types/export'

const NOT_FILLED = 'Non renseigné'
const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).export.stats

const handler = async ({
  input,
  ctx: { user, structure }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  const exportData: WorksheetType[] = []

  const helpRequestCount = await getHelpRequestCountQuery(user, input)

  // Instruction-type
  const fileInstructionType = await getFileInstructionTypeStatsQuery(
    user,
    input
  )
  const instructiontypeRows = fileInstructionType.map(item => {
    return {
      label: item.subject
        ? fileInstructionTypeKeys.byKey[item.subject]
        : NOT_FILLED,
      number: item._count.toString(),
      percent: `${getPercentage(item._count, helpRequestCount.total)}%`
    }
  })
  instructiontypeRows.push({
    label: 'Total',
    number: helpRequestCount.total.toString(),
    percent: '100%'
  })

  exportData.push({
    name: "Thématique d'instruction",
    columns: getColumns("Thématique d'instruction"),
    rows: instructiontypeRows
  })

  // Subject
  const subjectsData = await getHelpRequestSubjectsStatsQuery(user, input)
  const subjectRows = subjectsData
    .map(item => {
      if (item._count.socialSupports > 0) {
        return {
          label: item.name ? item.name : NOT_FILLED,
          number: item._count.socialSupports.toString(),
          percent: `${getPercentage(item._count.socialSupports, helpRequestCount.total)}%`
        }
      }
    })
    .filter(row => row != null)
  subjectRows.push({
    label: 'Total',
    number: helpRequestCount.total.toString(),
    percent: '100%'
  })
  exportData.push({
    name: "Objet d'accompagnement",
    columns: getColumns("Objet d'accompagnement"),
    rows: subjectRows
  })

  // Status
  const helpRequestStatusData = await getHelpRequestStatusStatsQuery(
    user,
    input
  )
  const helpRequestStatusRows = helpRequestStatusData.map(item => {
    return {
      label: socialSupportStatusKeys.byKey[item.status] || NOT_FILLED,
      number: item._count.toString(),
      percent: `${getPercentage(item._count, helpRequestCount.total)}%`
    }
  })
  helpRequestStatusRows.push({
    label: 'Total',
    number: helpRequestCount.total.toString(),
    percent: '100%'
  })

  exportData.push({
    name: 'Statuts',
    columns: getColumns('Statuts'),
    rows: helpRequestStatusRows
  })

  if (structure.type === StructureType.Ministere) {
    // Ministre
    const helpRequestMinistreData = await getHelpRequestMinistreStatsQuery(
      user,
      input
    )
    const helpRequestMinistreRows = helpRequestMinistreData.map(item => {
      return {
        label: item.ministre ? item.ministre : NOT_FILLED,
        number: item._count.toString(),
        percent: `${getPercentage(item._count, helpRequestCount.total)}%`
      }
    })
    helpRequestMinistreRows.push({
      label: 'Total',
      number: helpRequestCount.total.toString(),
      percent: `100%`
    })

    exportData.push({
      name: 'Ministres',
      columns: getColumns('Ministres'),
      rows: helpRequestMinistreRows
    })
  }

  // Help request prescribing organizations
  const helpRequestPrescribingOrganizationData =
    await getHelpRequestPrescribingOrganizationStatsQuery(user, input)
  const getPrescribingOrganizationTotal = () => {
    let total = 0
    let subTotal = 0
    helpRequestPrescribingOrganizationData.forEach(item => {
      total = total + item._count
      if (item.prescribingOrganizationId != 'null') {
        subTotal = subTotal + item._count
      }
    })
    return { total, subTotal }
  }
  const prescribingOrganizationTotal = getPrescribingOrganizationTotal()
  const generalPrescribingOrganization = [
    {
      label: "Dossiers d'instruction avec prescripteur renseigné",
      number: prescribingOrganizationTotal.subTotal.toString(),
      percent: `${getPercentage(prescribingOrganizationTotal.subTotal, prescribingOrganizationTotal.total)}%`
    }
  ]
  const prescribingOrganizationDivider =
    helpRequestPrescribingOrganizationData.length > 0
      ? [
          {
            label: 'RÉPARTITION DES ORGANISMES PRESCRIPTEURS',
            number: '',
            percent: ''
          },
          {
            label:
              'Pourcentage calculé sur le nombre total des instructions de dossiers.',
            number: '',
            percent: ''
          }
        ]
      : []
  const prescribingOrganizationRows =
    helpRequestPrescribingOrganizationData.map(item => {
      return {
        label: item.prescribingOrganization,
        number: item._count.toString(),
        percent: `${getPercentage(item._count, prescribingOrganizationTotal.total)}%`
      }
    })

  exportData.push({
    name: 'Organismes prescripteurs',
    columns: getColumns('Organismes prescripteurs'),
    rows: [
      ...generalPrescribingOrganization,
      ...prescribingOrganizationDivider,
      ...prescribingOrganizationRows
    ]
  })

  // Instructions
  const instructions = await getHelpRequestInstructionsStats(user, input)
  const instructionsDistributionRows = [
    {
      label: 'Instructions en externe',
      number: instructions.fileInstructions.externalStructure._count.toString(),
      percent: `${getPercentage(instructions.fileInstructions.externalStructure._count, instructions.fileInstructions._count)}%`
    },
    {
      label: 'Instructions en interne',
      number: instructions.fileInstructions.internalStructure._count.toString(),
      percent: `${getPercentage(instructions.fileInstructions.internalStructure._count, instructions.fileInstructions._count)}%`
    }
  ]
  const separationRows =
    instructions.fileInstructions.instructorOrganization.length > 0
      ? [
          {
            label: 'RÉPARTITION DES INSTRUCTIONS EXTERNES',
            number: '',
            percent: ''
          },
          {
            label:
              'Pourcentage calculé sur le nombre de dossiers instruits en externe.',
            number: '',
            percent: ''
          }
        ]
      : []
  const getExternalTotalCount = () => {
    let total = 0
    instructions.fileInstructions.instructorOrganization.forEach(item => {
      total = total + item._count
    })
    return total
  }
  const externalTotalCount = getExternalTotalCount()
  const externalInstructionsRow = Object.values(
    instructions.fileInstructions.instructorOrganization
  ).map(item => {
    return {
      label: item.name,
      number: item._count.toString(),
      percent: `${getPercentage(item._count, externalTotalCount)}%`
    }
  })

  exportData.push({
    name: 'Instructions',
    columns: getColumns('Instructions'),
    rows: [
      ...instructionsDistributionRows,
      ...separationRows,
      ...externalInstructionsRow
    ]
  })

  // Amounts allocated
  const amountsAllocated = await getHelpRequestAmountsAllocatedQuery(
    user,
    input
  )

  const amountsAllocatedColumns = [
    { key: 'label', header: '' },
    { key: 'allocated', header: 'Montant délivré' },
    { key: 'asked', header: 'Montant demandé' },
    { key: 'percent', header: 'Pourcentage' }
  ]

  const amountsAllocatedRows = amountsAllocated.breakdown.map(breakdown => ({
    label: breakdown.label,
    allocated: breakdown.count.toFixed(2) + ' €',
    asked: breakdown.subCount.toFixed(2) + ' €',
    percent: `${getPercentage(breakdown.count, breakdown.subCount)}%`
  }))

  exportData.push({
    name: 'Montants des aides délivrées',
    columns: amountsAllocatedColumns,
    rows: amountsAllocatedRows
  })

  // Amounts allocated by instructor organization
  const amountsByInstructorOrganization =
    await getHelpRequestAmountsByInstructorOrganizationQuery(user, input)

  const amountsByInstructorColumns = [
    { key: 'label', header: 'Organisme instructeur' },
    { key: 'allocated', header: 'Montant délivré' },
    { key: 'asked', header: 'Montant demandé' },
    { key: 'percent', header: 'Pourcentage' }
  ]

  const amountsByInstructorOrganizationRows =
    amountsByInstructorOrganization.map(amount => ({
      label: amount.label,
      allocated: amount.count.toFixed(2) + ' €',
      asked: amount.subCount.toFixed(2) + ' €',
      percent: `${getPercentage(amount.count, amount.subCount)}%`
    }))
  amountsByInstructorOrganizationRows.push({
    label: 'TOTAL',
    allocated:
      amountsByInstructorOrganization
        .map(amount => amount.count)
        .reduce((acc, cur) => acc + cur, 0)
        .toFixed(2) + ' €',
    asked:
      amountsByInstructorOrganization
        .map(amount => amount.subCount)
        .reduce((acc, cur) => acc + cur, 0)
        .toFixed(2) + ' €',
    percent: '100%'
  })

  exportData.push({
    name: 'Montants organisme instructeur',
    columns: amountsByInstructorColumns,
    rows: amountsByInstructorOrganizationRows
  })

  // Amounts allocated by social support subject
  const amountsBySubject = await getHelpRequestAmountsBySubjectQuery(
    user,
    input
  )

  const amountsBySubjectColumns = [
    { key: 'label', header: "Objet d'accompagnement" },
    { key: 'allocated', header: 'Montant délivré' }
  ]

  const amountsBySubjectRows = amountsBySubject.map(amount => ({
    label: amount.label,
    allocated: amount.count.toFixed(2) + ' €'
  }))
  amountsBySubjectRows.push({
    label: 'TOTAL',
    allocated:
      amountsBySubject
        .map(amount => amount.count)
        .reduce((acc, cur) => acc + cur, 0)
        .toFixed(2) + ' €'
  })

  exportData.push({
    name: "Montants objet d'accompagnement",
    columns: amountsBySubjectColumns,
    rows: amountsBySubjectRows
  })

  // Housing request
  const housingRequest = await getHelpRequestHousingStatsQuery(user, input)
  const contextValue = (value: boolean | null) => {
    switch (value) {
      case true:
        return '1ère demande'
      case false:
        return 'Renouvellement'
      case null:
        return 'Non renseigné'
    }
  }
  const housingRequestContextRow =
    housingRequest.housingHelpRequestContextCount.map(item => {
      return {
        label: contextValue(item.isFirst),
        number: item._count.toString(),
        percent: `${getPercentage(item._count, housingRequest.housingHelpRequestCount)}%`
      }
    })
  const housingRequestContextReasonHeader = [
    {
      label: 'Motif des demandes de logement',
      number: '',
      percent: ''
    }
  ]
  const housingRequestContextReason =
    housingRequest.housingHelpRequestReasonCount.map(item => {
      return {
        label: item.reason ? item.reason : 'Non renseigné',
        number: item._count.toString(),
        percent: `${getPercentage(item._count, housingRequest.housingHelpRequestCount)}%`
      }
    })

  exportData.push({
    name: 'Demandes de logement',
    columns: getColumns('Demandes de logement'),
    rows: [
      ...housingRequestContextRow,
      ...housingRequestContextReasonHeader,
      ...housingRequestContextReason
    ]
  })

  const stream = await createExport(user.id, exportData)

  return { data: stream.toString('base64') }
}

export const exportHelpRequestStatsQuery = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
