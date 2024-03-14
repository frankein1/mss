import { StructureType } from '@prisma/client'
import { getRowsFromData } from '../helper/getRowsFromData'
import { createQuery } from '~/server/route'
import {
  beneficiaryAccommodationModeKeys,
  beneficiaryAccommodationZoneKeys,
  beneficiaryGenderKeys,
  beneficiaryMobilityKeys,
  beneficiarySocioProfessionalCategoryKeys,
  familySituationLabels,
  ageGroupLabels,
  STATS_NULL_LABEL,
  ministereCategorieLabels,
  ministereDepartmentServiceAcLabels,
  ministereStructureLabels
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
  getMinistereCategorieStatsQuery
} from '~/server/query/stats'
import { StatFilterInput, statFilterSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'
import { getColumnsFromLabels } from '~/utils/export/getColumnsFromLabels'
import { STATS_NULL_KEY } from '~/utils/constants/stats'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'

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

  const genderData = await getGenderStatsQuery(user, input)
  const genderColumns = getColumnsFromLabels(beneficiaryGenderKeys.byKey)
  const genderRows = getRowsFromData(genderData, 'gender', beneficiaryCount)
  exportData.push({
    name: 'Genres',
    columns: genderColumns,
    rows: genderRows
  })

  const ageData = await getAgeStatsQuery(user, input)
  const ageColumns = getColumnsFromLabels(ageGroupLabels)
  const ageRows = getRowsFromData(ageData, 'ageGroup', beneficiaryCount)
  exportData.push({
    name: "Tranches d'âge",
    columns: ageColumns,
    rows: ageRows
  })

  const familyData = await getFamilyStatsQuery(user, input)
  const familyColumns = getColumnsFromLabels(familySituationLabels)
  const familyRows = getRowsFromData(
    familyData,
    'familySituation',
    beneficiaryCount
  )
  exportData.push({
    name: 'Types de situations familiales',
    columns: familyColumns,
    rows: familyRows
  })

  const cityData = await getCityStatsQuery(user, input)
  const cityColumns = cityData.map(({ city }) => ({
    key: city || STATS_NULL_KEY,
    header: city || STATS_NULL_LABEL
  }))
  const cityRows = getRowsFromData(cityData, 'city', beneficiaryCount)
  exportData.push({
    name: 'Villes',
    columns: cityColumns,
    rows: cityRows
  })

  const regionData = await getRegionStatsQuery(user, input)
  const regionColumns = regionData.map(({ region }) => ({
    key: region || STATS_NULL_KEY,
    header: region || STATS_NULL_LABEL
  }))
  const regionRows = getRowsFromData(regionData, 'region', beneficiaryCount)
  exportData.push({
    name: 'Régions',
    columns: regionColumns,
    rows: regionRows
  })

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
    columns: accommodationZoneColumns,
    rows: accommodationZoneRows
  })

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
    columns: accommodationModeColumns,
    rows: accommodationModeRows
  })

  const mobilityData = await getMobilityStatsQuery(user, input)
  const mobilityColumns = getColumnsFromLabels(beneficiaryMobilityKeys.byKey)
  const mobilityRows = getRowsFromData(
    mobilityData,
    'mobility',
    beneficiaryCount
  )
  exportData.push({
    name: 'Données mobilité',
    columns: mobilityColumns,
    rows: mobilityRows
  })

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
    columns: CSPColumns,
    rows: CSPRows
  })

  if (structure.type === StructureType.Ministere) {
    const ministereStructureData = await getMinistereStructureStatsQuery(
      user,
      input
    )
    const ministereStructureColumns = getColumnsFromLabels(
      ministereStructureLabels
    )
    const ministereStructureRows = getRowsFromData(
      ministereStructureData,
      'ministereStructure',
      beneficiaryCount
    )
    exportData.push({
      name: 'Structures de rattachement',
      columns: ministereStructureColumns,
      rows: ministereStructureRows
    })

    const ministereDepartementData =
      await getMinistereDepartementServiceAcStatsQuery(user, input)
    const ministereDepartementColumns = getColumnsFromLabels(
      ministereDepartmentServiceAcLabels
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
      columns: ministereDepartementColumns,
      rows: ministereDepartementRows
    })

    const ministereCategorieData = await getMinistereCategorieStatsQuery(
      user,
      input
    )
    const ministereCategorieColumns = getColumnsFromLabels(
      ministereCategorieLabels
    )
    const ministereCategorieRows = getRowsFromData(
      ministereCategorieData,
      'ministereCategorie',
      beneficiaryCount
    )
    exportData.push({
      name: 'Catégories',
      columns: ministereCategorieColumns,
      rows: ministereCategorieRows
    })
  }

  return await createExport(user.id, exportData)
}

export const exportBeneficiaryStatsQuery = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
