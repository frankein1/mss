import { AllowSecurityCheck } from '~~/server/security/rules/types'
import { createQuery } from '../../createRoute'
import {
  workshopStatFilterSchema,
  type WorkshopStatFilterInput
} from '~~/server/schema'
import type { ProtectedAppContext } from '~~/server/trpc'
import { getWorkshopGender } from './get-workshop-attendee-gender-stats.query'
import { STATS_NULL_LABEL } from '~/utils/constants/stats'
import {
  ageGroupKeys,
  beneficiaryGenderKeys,
  workshopAttendeeAttendanceKeys
} from '~~/client/options'
import { getWorkshopCountStats } from './get-workshop-count-stats.query'
import { createExportFromWorkbook } from '~/utils/export/createExport'
import { getWorkshopAttendeeCount } from './get-workshop-attendee-count-stats.query'
import { getWorkshopNameStats } from './get-workshop-name-stats.query'
import { getWorkshopAttendance } from './get-workshop-attendance-stats.query'
import { getWorkshopAttendeeAge } from './get-workshop-attendee-age-stats.query'
import { getWorkshopPartners } from './get-workshop-partner-stats.query'
import { getWorkshopCities } from './get-workshop-attendee-city-stats.query'
import ExcelPkg from 'exceljs'
import type { Workbook } from 'exceljs'

type StatsRow = { label: string; number: number | null; percent: number | null }
type WorkshopNameRow = { label: string; number: number }

const toRatio = (count: number, total: number): number | null =>
  total > 0 ? count / total : null

function addStatsWorksheet(workbook: Workbook, name: string, rows: StatsRow[]) {
  const worksheet = workbook.addWorksheet(name)
  worksheet.columns = [
    { key: 'label', header: name, width: 32 },
    { key: 'number', header: 'Nombre', width: 14, style: { numFmt: '0' } },
    {
      key: 'percent',
      header: 'Pourcentage',
      width: 14,
      style: { numFmt: '0.00%' }
    }
  ]
  worksheet.getRow(1).font = { bold: true }
  worksheet.views = [{ state: 'frozen', ySplit: 1 }]
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: worksheet.columnCount }
  }
  rows.forEach(rowData => worksheet.addRow(rowData))
}

function addWorkshopNamesWorksheet(
  workbook: Workbook,
  rows: WorkshopNameRow[]
) {
  const worksheet = workbook.addWorksheet("Nombre d'ateliers")
  worksheet.columns = [
    { key: 'label', header: 'Nom', width: 32 },
    {
      key: 'number',
      header: "Nombre d'ateliers",
      width: 18,
      style: { numFmt: '0' }
    }
  ]
  worksheet.getRow(1).font = { bold: true }
  worksheet.views = [{ state: 'frozen', ySplit: 1 }]
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: worksheet.columnCount }
  }
  rows.forEach(rowData => worksheet.addRow(rowData))
}

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx
}: {
  input: WorkshopStatFilterInput
  ctx: ProtectedAppContext
}) => {
  const { Workbook: WorkbookConstructor } = ExcelPkg
  const workbook = new WorkbookConstructor()

  const workshopCount = await getWorkshopCountStats(input, ctx)
  const workshopAttendeeCount = await getWorkshopAttendeeCount(input, ctx)
  const attendeeTotal = workshopAttendeeCount[0]?._count ?? null

  // Workshop names and count
  const names = await getWorkshopNameStats(input, ctx)
  addWorkshopNamesWorksheet(
    workbook,
    names.map(({ name, _count }) => ({
      label: name || STATS_NULL_LABEL,
      number: _count
    }))
  )

  // Workshop attendees
  const attendances = await getWorkshopAttendance(input, ctx)
  const totalPassedAttendees = attendances.reduce(
    (acc, val) => acc + val._count,
    0
  )
  addStatsWorksheet(
    workbook,
    'Présences',
    attendances.map(({ attendance, _count }) => ({
      label:
        workshopAttendeeAttendanceKeys.value(attendance) || STATS_NULL_LABEL,
      number: _count,
      percent: toRatio(_count, totalPassedAttendees)
    }))
  )

  // Attendee gender
  const genders = await getWorkshopGender(input, ctx)
  addStatsWorksheet(
    workbook,
    'Genre',
    genders.map(({ gender, _count }) => ({
      label: beneficiaryGenderKeys.value(gender) || STATS_NULL_LABEL,
      number: _count,
      percent: attendeeTotal ? toRatio(_count, attendeeTotal) : null
    }))
  )

  // Age
  const ages = await getWorkshopAttendeeAge(input, ctx)
  addStatsWorksheet(
    workbook,
    "Tranches d'âge",
    ages.map(({ ageGroup, _count }) => ({
      label: ageGroupKeys.value(ageGroup) || STATS_NULL_LABEL,
      number: _count,
      percent: attendeeTotal ? toRatio(_count, attendeeTotal) : null
    }))
  )

  // Partners
  const workshopPartners = await getWorkshopPartners(input, ctx)
  addStatsWorksheet(
    workbook,
    'Partenaires',
    workshopPartners.map(({ name, _count }) => ({
      label: name || STATS_NULL_LABEL,
      number: _count,
      percent: toRatio(_count, workshopCount.total)
    }))
  )

  // City
  const cities = await getWorkshopCities(input, ctx)
  addStatsWorksheet(
    workbook,
    'Villes',
    cities.map(({ city, _count }) => ({
      label: city || STATS_NULL_LABEL,
      number: _count,
      percent: attendeeTotal ? toRatio(_count, attendeeTotal) : null
    }))
  )

  const stream = await createExportFromWorkbook(ctx.user.id, workbook)
  return { data: stream.toString('base64') }
}

export const exportWorkshopStatsQuery = createQuery({
  inputValidation: workshopStatFilterSchema,
  securityCheck,
  handler
})
