import {
  getAppContextPermissions,
  type SecurityRuleContext
} from '~/server/security'
import { createQuery } from '../../createRoute'
import { statFilterSchema, type WorkshopStatFilterInput } from '~/server/schema'
import type { ProtectedAppContext } from '~/server/trpc'
import { getWorkshopGender } from './get-workshop-attendee-gender-stats.query'
import { getColumns } from '~/utils/export/getColumns'
import { STATS_NULL_LABEL } from '~/utils/constants/stats'
import {
  ageGroupKeys,
  beneficiaryGenderKeys,
  workshopAttendeeAttendanceKeys
} from '~/client/options'
import { getWorkshopCountStats } from './get-workshop-count-stats.query'
import { createExport } from '~/utils/export/createExport'
import { getPercentage } from '~/utils/stats'
import { getWorkshopAttendeeCount } from './get-workshop-attendee-count-stats.query'
import { getWorkshopNameStats } from './get-workshop-name-stats.query'
import { getWorkshopAttendance } from './get-workshop-attendance-stats.query'
import { getWorkshopAttendeeAge } from './get-workshop-attendee-age-stats.query'
import { getWorkshopPartners } from './get-workshop-partner-stats.query'
import { getWorkshopCities } from './get-workshop-attendee-city-stats.query'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).export.stats

const handler = async ({
  input,
  ctx
}: {
  input: WorkshopStatFilterInput
  ctx: ProtectedAppContext
}) => {
  const exportData = []
  const workshopCount = await getWorkshopCountStats(input, ctx)
  const workshopAttendeeCount = await getWorkshopAttendeeCount(input, ctx)

  // Workshop names and count
  const names = await getWorkshopNameStats(input, ctx)
  const nameRows = names.map(({ name, _count }) => ({
    label: name || STATS_NULL_LABEL,
    number: _count.toString()
  }))
  exportData.push({
    name: 'Nombre d’ateliers',
    columns: [
      { header: 'Nom', key: 'label' },
      { header: "Nombre d'ateliers", key: 'number' }
    ],
    rows: nameRows
  })

  // Workshop attendees
  const attendances = await getWorkshopAttendance(input, ctx)
  const attendanceColumns = getColumns('Présences')
  const totalPassedAttendancees = attendances.reduce((acc, val) => {
    return acc + val._count
  }, 0)
  const attendanceRows = attendances.map(({ attendance, _count }) => ({
    label: workshopAttendeeAttendanceKeys.value(attendance) || STATS_NULL_LABEL,
    number: _count.toString(),
    percent: `${getPercentage(_count, totalPassedAttendancees)}%`
  }))
  exportData.push({
    name: 'Présences',
    columns: attendanceColumns,
    rows: attendanceRows
  })

  // Attendee gender
  const genders = await getWorkshopGender(input, ctx)
  const genderColumns = getColumns('Genre')
  const genderRows = genders.map(({ gender, _count }) => ({
    label: beneficiaryGenderKeys.value(gender) || STATS_NULL_LABEL, // use beneficiaryGenderKeys
    number: _count.toString(),
    percent: workshopAttendeeCount[0]
      ? `${getPercentage(_count, workshopAttendeeCount[0]._count)}%`
      : '-' // use only Main list
  }))
  exportData.push({ name: 'Genre', columns: genderColumns, rows: genderRows })

  // Age
  const ages = await getWorkshopAttendeeAge(input, ctx)
  const ageColumns = getColumns("Tranches d'âge")
  const ageRows = ages.map(({ ageGroup, _count }) => ({
    label: ageGroupKeys.value(ageGroup) || STATS_NULL_LABEL,
    number: _count.toString(),
    percent: workshopAttendeeCount[0]
      ? `${getPercentage(_count, workshopAttendeeCount[0]._count)}%`
      : '-' // use only Main list
  }))
  exportData.push({
    name: "Tranches d'âge",
    columns: ageColumns,
    rows: ageRows
  })

  // Partners
  const workshopPartners = await getWorkshopPartners(input, ctx)
  const partnerColumns = getColumns('Partenaires')
  const partnerRows = workshopPartners.map(({ name, _count }) => ({
    label: name || STATS_NULL_LABEL,
    number: _count.toString(),
    percent: `${getPercentage(_count, workshopCount.total)}%`
  }))
  exportData.push({
    name: 'Partenaires',
    columns: partnerColumns,
    rows: partnerRows
  })

  // City
  const cities = await getWorkshopCities(input, ctx)
  const cityColumns = getColumns('Villes')
  const cityRows = cities.map(({ city, _count }) => ({
    label: city || STATS_NULL_LABEL,
    number: _count.toString(),
    percent: workshopAttendeeCount[0]
      ? `${getPercentage(_count, workshopAttendeeCount[0]._count)}%`
      : '-' // use only Main list
  }))
  exportData.push({
    name: 'Villes',
    columns: cityColumns,
    rows: cityRows
  })

  // Export
  const stream = await createExport(ctx.user.id, exportData)
  return { data: stream.toString('base64') }
}

export const exportWorkshopStatsQuery = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
