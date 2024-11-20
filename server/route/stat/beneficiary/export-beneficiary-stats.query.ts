import { StructureType } from '@prisma/client'
import { getRowsFromData } from '../helper/getRowsFromData'
import { createQuery } from '~/server/route'
import {
  beneficiaryAccommodationModeKeys,
  beneficiaryAccommodationZoneKeys,
  beneficiaryGenderKeys,
  beneficiaryMobilityKeys,
  beneficiarySocioProfessionalCategoryKeys,
  familySituationKeys,
  ageGroupKeys,
  ministereCategorieKeys,
  ministereDepartmentServiceAcKeys,
  ministereStructureKeys
} from '~/client/options'
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
  getMinistereStructureStatsQuery,
  getMinistereDepartementServiceAcStatsQuery,
  getMinistereCategorieStatsQuery,
  getDepartmentStatsQuery
} from '~/server/query/stats'
import { StatFilterInput, statFilterSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'
import { getColumnsFromLabels } from '~/utils/export/getColumnsFromLabels'
import { STATS_NULL_KEY, STATS_NULL_LABEL } from '~/utils/constants/stats'
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
  ctx: { user, structure }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  const exportData = []

  const beneficiaryCount = await getBeneficiaryCountQuery(user, input)

  // Gender
  const genderData = await getGenderStatsQuery(user, input)
  const genderColumns = getColumnsFromLabels(beneficiaryGenderKeys.byKey)
  const genderRows = getRowsFromData(genderData, 'gender', beneficiaryCount)
  exportData.push({
    name: 'Genre',
    columns: getTransposedColumns('gender', 'Genre'),
    rows: transposeRows(genderColumns, genderRows, 'gender')
  })

  // Age
  const ageData = await getAgeStatsQuery(user, input)
  const ageColumns = getColumnsFromLabels(ageGroupKeys.byKey)
  const ageRows = getRowsFromData(ageData, 'ageGroup', beneficiaryCount)

  exportData.push({
    name: "Tranches d'âge",
    columns: getTransposedColumns('ageGroup', "Tranches d'âge"),
    rows: transposeRows(ageColumns, ageRows, 'ageGroup')
  })

  // Family situation
  const familyData = await getFamilyStatsQuery(user, input)
  const familyColumns = getColumnsFromLabels(familySituationKeys.byKey)
  const familyRows = getRowsFromData(
    familyData,
    'familySituation',
    beneficiaryCount
  )
  exportData.push({
    name: 'Types de situations familiales',
    columns: getTransposedColumns(
      'familySituation',
      'Types de situations familiales'
    ),
    rows: transposeRows(familyColumns, familyRows, 'familySituation')
  })

  // Cities
  const cityData = await getCityStatsQuery(user, input)
  const cityColumns = cityData.map(({ city }) => ({
    key: city || STATS_NULL_KEY,
    header: city || STATS_NULL_LABEL
  }))
  const cityRows = getRowsFromData(cityData, 'city', beneficiaryCount)
  exportData.push({
    name: 'Villes',
    columns: getTransposedColumns('city', 'Villes'),
    rows: transposeRows(cityColumns, cityRows, 'city')
  })

  // Departments
  const departmentData = await getDepartmentStatsQuery(user, input)
  const departmentColumns = departmentData.map(({ department }) => ({
    key: department || STATS_NULL_KEY,
    header: department || STATS_NULL_LABEL
  }))
  const departmentRows = getRowsFromData(
    departmentData,
    'department',
    beneficiaryCount
  )
  exportData.push({
    name: 'Départements',
    columns: getTransposedColumns('department', 'Départements'),
    rows: transposeRows(departmentColumns, departmentRows, 'department')
  })

  // Regions
  const regionData = await getRegionStatsQuery(user, input)
  const regionColumns = regionData.map(({ region }) => ({
    key: region || STATS_NULL_KEY,
    header: region || STATS_NULL_LABEL
  }))
  const regionRows = getRowsFromData(regionData, 'region', beneficiaryCount)
  exportData.push({
    name: 'Régions',
    columns: getTransposedColumns('region', 'Régions'),
    rows: transposeRows(regionColumns, regionRows, 'region')
  })

  // Accommodation zone
  const accommodationZoneData = await getAccommodationZoneStatsQuery(
    user,
    input
  )
  const accommodationZoneColumns = getColumnsFromLabels(
    beneficiaryAccommodationZoneKeys.byKey
  )
  const accommodationZoneRows = getRowsFromData(
    accommodationZoneData,
    'accommodationZone',
    beneficiaryCount
  )
  exportData.push({
    name: "Zones d'hébergement",
    columns: getTransposedColumns('accommodationZone', "Zones d'hébergement"),
    rows: transposeRows(
      accommodationZoneColumns,
      accommodationZoneRows,
      'accommodationZone'
    )
  })

  // Accomodation mode
  const accommodationModeData = await getAccommodationModeStatsQuery(
    user,
    input
  )
  const accommodationModeColumns = getColumnsFromLabels(
    beneficiaryAccommodationModeKeys.byKey
  )
  const accommodationModeRows = getRowsFromData(
    accommodationModeData,
    'accommodationMode',
    beneficiaryCount
  )
  exportData.push({
    name: "Modes d'hébergement",
    columns: getTransposedColumns('accommodationMode', "Modes d'hébergement"),
    rows: transposeRows(
      accommodationModeColumns,
      accommodationModeRows,
      'accommodationMode'
    )
  })

  // Mobility data
  const mobilityData = await getMobilityStatsQuery(user, input)
  const mobilityColumns = getColumnsFromLabels(beneficiaryMobilityKeys.byKey)
  const mobilityRows = getRowsFromData(
    mobilityData,
    'mobility',
    beneficiaryCount
  )
  exportData.push({
    name: 'Données mobilité',
    columns: getTransposedColumns('mobility', 'Données mobilité'),
    rows: transposeRows(mobilityColumns, mobilityRows, 'mobility')
  })

  // CSP
  const CSPData = await getCSPStatsQuery(user, input)
  const CSPColumns = getColumnsFromLabels(
    beneficiarySocioProfessionalCategoryKeys.byKey
  )
  const CSPRows = getRowsFromData(
    CSPData,
    'socioProfessionalCategory',
    beneficiaryCount
  )
  exportData.push({
    // FIXME:  ExcelJS 31 characters limit for worksheet names
    // Cf. https://github.com/exceljs/exceljs/issues/398
    // name: 'Catégories socio-professionnelles',
    name: 'CSP',
    columns: getTransposedColumns(
      'socioProfessionalCategory',
      'Catégories socio-professionnelles'
    ),
    rows: transposeRows(CSPColumns, CSPRows, 'socioProfessionalCategory')
  })

  if (structure.type === StructureType.Ministere) {
    // Ministere structure
    const ministereStructureData = await getMinistereStructureStatsQuery(
      user,
      input
    )
    const ministereStructureColumns = getColumnsFromLabels(
      ministereStructureKeys.byKey
    )
    const ministereStructureRows = getRowsFromData(
      ministereStructureData,
      'ministereStructure',
      beneficiaryCount
    )
    exportData.push({
      name: 'Structures de rattachement',
      columns: getTransposedColumns(
        'ministereStructure',
        'Structures de rattachement'
      ),
      rows: transposeRows(
        ministereStructureColumns,
        ministereStructureRows,
        'ministereStructure'
      )
    })

    // Ministere departement service
    const ministereDepartementData =
      await getMinistereDepartementServiceAcStatsQuery(user, input)
    const ministereDepartementColumns = getColumnsFromLabels(
      ministereDepartmentServiceAcKeys.byKey
    )
    const ministereDepartementRows = getRowsFromData(
      ministereDepartementData,
      'ministereDepartementServiceAc',
      beneficiaryCount
    )
    exportData.push({
      // FIXME: ExcelJS 31 characters limit for worksheet names
      // Cf. https://github.com/exceljs/exceljs/issues/398
      // name: "Départements ou services de l'administration centrale",
      name: "Départements de l'AC",
      columns: getTransposedColumns(
        'ministereDepartementServiceAc',
        "Départements ou services de l'administration centrale"
      ),
      rows: transposeRows(
        ministereDepartementColumns,
        ministereDepartementRows,
        'ministereDepartementServiceAc'
      )
    })

    // Ministere category
    const ministereCategorieData = await getMinistereCategorieStatsQuery(
      user,
      input
    )
    const ministereCategorieColumns = getColumnsFromLabels(
      ministereCategorieKeys.byKey
    )
    const ministereCategorieRows = getRowsFromData(
      ministereCategorieData,
      'ministereCategorie',
      beneficiaryCount
    )
    exportData.push({
      name: 'Catégories',
      columns: getTransposedColumns('ministereCategorie', 'Catégories'),
      rows: transposeRows(
        ministereCategorieColumns,
        ministereCategorieRows,
        'ministereCategorie'
      )
    })
  }

  return await createExport(user.id, exportData)
}

export const exportBeneficiaryStatsQuery = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
