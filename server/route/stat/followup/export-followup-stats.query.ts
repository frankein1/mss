import { StructureType } from '@prisma/client'
import { createQuery } from '~/server/route'
import {
  followupDurationKeys,
  followupMediumKeys,
  socialSupportStatusKeys
} from '~/client/options'
import { WorksheetType } from '~/types/export'
import {
  getFollowupActionsEntreprisesStatsQuery,
  getFollowupCountQuery,
  getFollowupSubjectsStatsQuery,
  getFollowupMediumStatsQuery,
  getFollowupMinistreStatsQuery,
  getFollowupPrescribingOrganizationStatsQuery,
  getFollowupStatusStatsQuery,
  getFollowupDurationStatsQuery,
  getFollowupMeanTimeStatsQuery
} from '~/server/query/stats'
import { StatFilterInput, statFilterSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'
import { getPercentage } from '~/utils/stats'
import { getColumns } from '~/utils/export/getColumns'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
import { STATS_NULL_LABEL } from '~/utils/constants/stats'
import { getSocialSupportSubjectTotalDuration } from '~/utils/followups/getSocialSupportSubjetcTotalDuration'

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

  const followupCount = await getFollowupCountQuery(user, input)

  // Subjects
  const subjectsData = await getFollowupSubjectsStatsQuery(user, input)

  const subjectCountTotal = subjectsData
    .reduce((total, { _count }) => total + _count.socialSupports, 0)
    .toString()
  let totalSubjectPercent = 0
  const subjectRows = subjectsData.map(subject => {
    if (subject._count.socialSupports > 0) {
      totalSubjectPercent =
        totalSubjectPercent +
        (subject._count.socialSupports / followupCount) * 100
      return {
        label: subject.name || STATS_NULL_LABEL,
        number: subject._count.socialSupports.toString(),
        percent: `${getPercentage(subject._count.socialSupports, followupCount)}%`
      }
    }
  })
  subjectRows.push({
    label: 'Total',
    number: subjectCountTotal,
    percent: totalSubjectPercent.toFixed(1) + '%'
  })

  exportData.push({
    name: "Objets d'accompagnement",
    columns: getColumns("Objets d'accompagnement"),
    rows: subjectRows.filter(row => row != null)
  })

  // Followup medium
  const followupMediumData = await getFollowupMediumStatsQuery(user, input)

  const followupMediumRows = followupMediumData.map(item => {
    const label = followupMediumKeys.value(item.medium)
    return {
      label: (label || STATS_NULL_LABEL) as string,
      number: item._count.toString(),
      percent: `${getPercentage(item._count, followupCount)}%`
    }
  })
  followupMediumRows.push({
    label: 'Total',
    number: followupCount.toString(),
    percent: `100%`
  })

  exportData.push({
    name: "Types d'entretien",
    columns: getColumns("Types d'entretien"),
    rows: followupMediumRows
  })

  if (structure.type === StructureType.Ministere) {
    // Ministre
    const followupMinistreData = await getFollowupMinistreStatsQuery(
      user,
      input
    )
    const followupMinistreRows = followupMinistreData.map(item => {
      return {
        label: item.ministre || STATS_NULL_LABEL,
        number: item._count.toString(),
        percent: `${getPercentage(item._count, followupCount)}%`
      }
    })
    followupMinistreRows.push({
      label: 'Total',
      number: followupCount.toString(),
      percent: `100%`
    })

    exportData.push({
      name: 'Ministres',
      columns: getColumns('Ministres'),
      rows: followupMinistreRows
    })
  }

  // Status
  const followupStatusData = await getFollowupStatusStatsQuery(user, input)
  const followupStatusRows = followupStatusData.map(item => {
    return {
      label: item.status
        ? socialSupportStatusKeys.byKey[item.status]
        : STATS_NULL_LABEL,
      number: item._count.toString(),
      percent: `${getPercentage(item._count, followupCount)}%`
    }
  })
  followupStatusRows.push({
    label: 'Total',
    number: followupCount.toString(),
    percent: '100%'
  })

  exportData.push({
    name: 'Statuts',
    columns: getColumns('Status'),
    rows: followupStatusRows
  })

  // Actions
  const followupActionsEntreprisesData =
    await getFollowupActionsEntreprisesStatsQuery(user, input)

  const followupActionsEntreprisesRows = followupActionsEntreprisesData.map(
    item => {
      return {
        label: item.actionEntreprise || STATS_NULL_LABEL,
        number: item._count.toString(),
        percent: `${getPercentage(item._count, followupCount)}%`
      }
    }
  )
  followupActionsEntreprisesRows.push({
    label: 'Total',
    number: followupCount.toString(),
    percent: '100%'
  })

  exportData.push({
    name: 'Actions entreprises',
    columns: getColumns('Actions entreprises'),
    rows: followupActionsEntreprisesRows
  })

  // Prescribing Organizations
  const followupPrescribingOrganizationData =
    await getFollowupPrescribingOrganizationStatsQuery(user, input)

  const getPrescribingOrganizationTotal = () => {
    let total = 0
    let subTotal = 0
    followupPrescribingOrganizationData.forEach(item => {
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
      label: 'Entretiens avec prescripteur renseigné',
      number: prescribingOrganizationTotal.subTotal.toString(),
      percent: `${getPercentage(prescribingOrganizationTotal.subTotal, prescribingOrganizationTotal.total)}%`
    }
  ]
  const prescribingOrganizationDivider =
    followupPrescribingOrganizationData.length > 0
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
  const prescribingOrganizationRows = followupPrescribingOrganizationData.map(
    item => {
      return {
        label: item.prescribingOrganization,
        number: item._count.toString(),
        percent: `${getPercentage(item._count, prescribingOrganizationTotal.total)}%`
      }
    }
  )

  const totalPrescribingOrganizationRow = [
    {
      label: 'Total',
      number: followupCount.toString(),
      percent: '100%'
    }
  ]

  exportData.push({
    name: 'Organismes prescripteurs',
    columns: getColumns('Organismes prescripteurs'),
    rows: [
      ...generalPrescribingOrganization,
      ...prescribingOrganizationDivider,
      ...prescribingOrganizationRows,
      ...totalPrescribingOrganizationRow
    ]
  })

  // Duration
  const followupDuration = await getFollowupDurationStatsQuery(user, input)
  const followupDurationRows = followupDuration.map(item => {
    return {
      label: item.duration
        ? followupDurationKeys.byKey[item.duration]
        : STATS_NULL_LABEL,
      number: item._count.toString(),
      percent: `${getPercentage(item._count, followupCount)}%`
    }
  })
  exportData.push({
    name: 'Durée des entretiens',
    columns: getColumns('Durée des entretiens'),
    rows: followupDurationRows
  })

  // Mean time
  const followupMeanTime = await getFollowupMeanTimeStatsQuery(user, input)
  const followupMeanTimeCols = [
    {
      key: 'label',
      header: 'Objet d’accompagnement'
    },
    {
      key: 'number',
      header: 'Durée en minutes'
    }
  ]
  const followupMeanTimeRows = followupMeanTime.map(item => {
    return {
      label: item.name,
      number: getSocialSupportSubjectTotalDuration(item.socialSupports).toFixed(
        0
      )
    }
  })
  const meanTime = () => {
    return (
      followupMeanTimeRows.reduce(
        (total: number, item) => total + Number(item.number),
        0
      ) / followupMeanTimeRows.length
    )
  }
  const followupTotalMeanTimeRows = [
    {
      label: 'Durée moyenne des entretiens',
      number: meanTime().toFixed(2)
    },
    {
      label: '',
      number: ''
    }
  ]

  exportData.push({
    name: 'Durée moyenne par objet d’accompagnement',
    columns: followupMeanTimeCols,
    rows: [...followupTotalMeanTimeRows, ...followupMeanTimeRows]
  })

  // Create export
  return await createExport(user.id, exportData)
}

export const exportFollowupStatsQuery = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
