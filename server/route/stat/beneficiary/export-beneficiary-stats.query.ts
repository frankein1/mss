import { StructureType } from '@prisma/client'
import { createQuery } from '~/server/route'
import {
  beneficiaryAccommodationModeKeys,
  beneficiaryAccommodationZoneKeys,
  beneficiaryGenderKeys,
  beneficiaryMobilityKeys,
  beneficiarySchoolClassKeys,
  beneficiarySocioProfessionalCategoryKeys,
  familySituationKeys,
  ageGroupKeys,
  ministereCategorieKeys,
  ministereDepartmentServiceAcKeys,
  ministereStructureKeys,
  getStatLabel,
  AgeGroup
} from '~/client/options'
import { repClassificationStatLabels } from '~/client/labels/school.labels'
import {
  getBeneficiaryCountQuery,
  getGenderStatsQuery,
  getAgeStatsQuery,
  getFamilyStatsQuery,
  getCityStatsQuery,
  getRegionStatsQuery,
  getAccommodationZoneStatsQuery,
  getAccommodationModeStatsQuery,
  getMobilityStatsQuery,
  getCSPStatsQuery,
  getSchoolClassStatsQuery,
  getRepClassificationStatsQuery,
  getMinistereStructureStatsQuery,
  getMinistereDepartementServiceAcStatsQuery,
  getMinistereCategorieStatsQuery,
  getDepartmentStatsQuery,
  getMinistereInterpellationStatsQuery
} from '~/server/query/stats'
import type { StatFilterInput } from '~/server/schema'
import { statFilterSchema } from '~/server/schema'
import type { ProtectedAppContext } from '~/server/trpc'
import { createExportFromWorkbook } from '~/utils/export/createExport'
import { STATS_NULL_LABEL } from '~/utils/constants/stats'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { getCustomAgeGroupLabel } from '~/utils/stats'
import ExcelPkg from 'exceljs'
import type { Workbook } from 'exceljs'

type StatsRow = { label: string; number: number; percent: number | null }

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

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).export.stats

const handler = async ({
  input,
  ctx: { user, structure }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  const { Workbook: WorkbookConstructor } = ExcelPkg
  const workbook = new WorkbookConstructor()

  const beneficiaryCount = await getBeneficiaryCountQuery(user, input)

  // Gender
  const genders = await getGenderStatsQuery(user, input)
  addStatsWorksheet(
    workbook,
    'Genre',
    genders.map(({ gender, _count }) => ({
      label: beneficiaryGenderKeys.value(gender) || STATS_NULL_LABEL,
      number: _count,
      percent: toRatio(_count, beneficiaryCount.count)
    }))
  )

  // Age
  const ages = await getAgeStatsQuery(user, input)
  addStatsWorksheet(
    workbook,
    "Tranches d'âge",
    ages.map(({ ageGroup, _count, fromAge, toAge }) => ({
      label:
        ageGroup === AgeGroup.Custom
          ? getCustomAgeGroupLabel(fromAge, toAge)
          : getStatLabel(ageGroupKeys.byKey, ageGroup),
      number: _count,
      percent: toRatio(_count, beneficiaryCount.count)
    }))
  )

  // Family situation
  const situations = await getFamilyStatsQuery(user, input)
  addStatsWorksheet(
    workbook,
    'Types de situations familiales',
    situations.map(({ familySituation, _count }) => ({
      label: familySituationKeys.value(familySituation) || STATS_NULL_LABEL,
      number: _count,
      percent: toRatio(_count, beneficiaryCount.count)
    }))
  )

  // Cities
  const cities = await getCityStatsQuery(user, input)
  addStatsWorksheet(
    workbook,
    'Villes',
    cities.map(({ city, _count }) => ({
      label: city || STATS_NULL_LABEL,
      number: _count,
      percent: toRatio(_count, beneficiaryCount.count)
    }))
  )

  // Departments
  const departments = await getDepartmentStatsQuery(user, input)
  addStatsWorksheet(
    workbook,
    'Départements',
    departments.map(({ department, _count }) => ({
      label: department || STATS_NULL_LABEL,
      number: _count,
      percent: toRatio(_count, beneficiaryCount.count)
    }))
  )

  // Regions
  const regions = await getRegionStatsQuery(user, input)
  addStatsWorksheet(
    workbook,
    'Régions',
    regions.map(({ region, _count }) => ({
      label: region || STATS_NULL_LABEL,
      number: _count,
      percent: toRatio(_count, beneficiaryCount.count)
    }))
  )

  if (structure.type === StructureType.Ministere) {
    // Accommodation zone
    const zones = await getAccommodationZoneStatsQuery(user, input)
    addStatsWorksheet(
      workbook,
      "Zones d'hébergement",
      zones.map(({ accommodationZone, _count }) => ({
        label:
          beneficiaryAccommodationZoneKeys.value(accommodationZone) ||
          STATS_NULL_LABEL,
        number: _count,
        percent: toRatio(_count, beneficiaryCount.count)
      }))
    )
  }

  // Accommodation mode
  const modes = await getAccommodationModeStatsQuery(user, input)
  addStatsWorksheet(
    workbook,
    "Modes d'hébergement",
    modes.map(({ accommodationMode, _count }) => ({
      label:
        beneficiaryAccommodationModeKeys.value(accommodationMode) ||
        STATS_NULL_LABEL,
      number: _count,
      percent: toRatio(_count, beneficiaryCount.count)
    }))
  )

  // Mobility data
  const mobilities = await getMobilityStatsQuery(user, input)
  addStatsWorksheet(
    workbook,
    'Données mobilité',
    mobilities.map(({ mobility, _count }) => ({
      label: beneficiaryMobilityKeys.value(mobility) || STATS_NULL_LABEL,
      number: _count,
      percent: toRatio(_count, beneficiaryCount.count)
    }))
  )

  // CSP
  const csps = await getCSPStatsQuery(user, input)
  addStatsWorksheet(
    workbook,
    'CSP',
    csps.map(({ socioProfessionalCategory, _count }) => ({
      label:
        beneficiarySocioProfessionalCategoryKeys.value(
          socioProfessionalCategory
        ) || STATS_NULL_LABEL,
      number: _count,
      percent: toRatio(_count, beneficiaryCount.count)
    }))
  )

  // School class
  const schoolClasses = await getSchoolClassStatsQuery(user, input)
  addStatsWorksheet(
    workbook,
    'Classes fréquentées',
    schoolClasses.map(({ schoolClass, _count }) => ({
      label: getStatLabel(beneficiarySchoolClassKeys.byKey, schoolClass),
      number: _count,
      percent: toRatio(_count, beneficiaryCount.count)
    }))
  )

  // REP classification
  const repClassifications = await getRepClassificationStatsQuery(user, input)
  addStatsWorksheet(
    workbook,
    'Fréquentation REP',
    repClassifications.map(({ repClassification, _count }) => ({
      label: repClassificationStatLabels[repClassification],
      number: _count,
      percent: toRatio(_count, beneficiaryCount.count)
    }))
  )

  if (structure.type === StructureType.Ministere) {
    // Ministere structure
    const structures = await getMinistereStructureStatsQuery(user, input)
    addStatsWorksheet(
      workbook,
      'Structures de rattachement',
      structures.map(({ ministereStructure, _count }) => ({
        label:
          ministereStructureKeys.value(ministereStructure) || STATS_NULL_LABEL,
        number: _count,
        percent: toRatio(_count, beneficiaryCount.count)
      }))
    )

    // Ministere departement service
    const services = await getMinistereDepartementServiceAcStatsQuery(
      user,
      input
    )
    addStatsWorksheet(
      workbook,
      "Départements de l'AC",
      services.map(({ ministereDepartementServiceAc, _count }) => ({
        label:
          ministereDepartmentServiceAcKeys.value(
            ministereDepartementServiceAc
          ) || STATS_NULL_LABEL,
        number: _count,
        percent: toRatio(_count, beneficiaryCount.count)
      }))
    )

    // Ministere category
    const categories = await getMinistereCategorieStatsQuery(user, input)
    addStatsWorksheet(
      workbook,
      'Catégories',
      categories.map(({ ministereCategorie, _count }) => ({
        label:
          ministereCategorieKeys.value(ministereCategorie) || STATS_NULL_LABEL,
        number: _count,
        percent: toRatio(_count, beneficiaryCount.count)
      }))
    )

    // Minister interpellations
    const interpellations = await getMinistereInterpellationStatsQuery(
      user,
      input
    )
    const totalCount = interpellations.reduce((acc, cur) => acc + cur._count, 0)
    addStatsWorksheet(
      workbook,
      'Interpellations de ministre',
      interpellations.map(({ minister, _count }) => ({
        label: minister || STATS_NULL_LABEL,
        number: _count,
        percent: toRatio(_count, totalCount)
      }))
    )
  }

  const stream = await createExportFromWorkbook(user.id, workbook)

  return { data: stream.toString('base64') }
}

export const exportBeneficiaryStatsQuery = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
