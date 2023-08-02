import { StructureType } from '@prisma/client'
import {
  beneficiaryAccommodationModeLabels,
  beneficiaryAccommodationZoneLabels,
  beneficiaryGenderLabels,
  beneficiaryMobilityLabels,
  beneficiarySocioProfessionalCategoryLabels
} from '~/client/options/beneficiary'
import { familySituationLabels } from '~/client/options/familySituation'
import { prismaClient } from '~/server/prisma'
import {
  getBeneficiaryCountQuery,
  getGenderStatsQuery,
  getAgeStatsQuery,
  getFamilyStatsQuery,
  getRegionStatsQuery,
  getAccommodationZoneStatsQuery,
  getAccommodationModeStatsQuery,
  getMobilityStatsQuery,
  getCSPStatsQuery,
  getMinistereStructureStatsQuery,
  getMinistereDepartementServiceAcStatsQuery
} from '~/server/query/stats'
import { StatFilterInput } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'
import { ageGroupLabels } from '~/client/options/ageGroup'
import { getColumnsFromLabels } from '~/utils/export/getColumnsFromLabels'
import { getRowsFromData } from '~/utils/export/getRowsFromData'
import { STATS_NULL_KEY } from '~/utils/constants/stats'
import { STATS_NULL_LABEL } from '~/client/options/stat'
import {
  ministereDepartmentServiceAcLabels,
  ministereStructureLabels
} from '~/client/options/ministry'

export const exportBeneficiaryStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  const exportData = []

  const beneficiaryCount = await getBeneficiaryCountQuery(
    user.structureId,
    input
  )

  const genderData = await getGenderStatsQuery(user.structureId, input)
  const genderColumns = getColumnsFromLabels(beneficiaryGenderLabels)
  const genderRows = getRowsFromData(genderData, 'gender', beneficiaryCount)
  exportData.push({
    name: 'Genres',
    columns: genderColumns,
    rows: genderRows
  })

  const ageData = await getAgeStatsQuery(user.structureId, input)
  const ageColumns = getColumnsFromLabels(ageGroupLabels)
  const ageRows = getRowsFromData(ageData, 'ageGroup', beneficiaryCount)
  exportData.push({
    name: "Tranches d'âge",
    columns: ageColumns,
    rows: ageRows
  })

  const familyData = await getFamilyStatsQuery(user.structureId, input)
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

  const regionData = await getRegionStatsQuery(user.structureId, input)
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
    user.structureId,
    input
  )
  const accommodationZoneColumns = getColumnsFromLabels(
    beneficiaryAccommodationZoneLabels
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
    user.structureId,
    input
  )
  const accommodationModeColumns = getColumnsFromLabels(
    beneficiaryAccommodationModeLabels
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

  const mobilityData = await getMobilityStatsQuery(user.structureId, input)
  const mobilityColumns = getColumnsFromLabels(beneficiaryMobilityLabels)
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

  const CSPData = await getCSPStatsQuery(user.structureId, input)
  const CSPColumns = getColumnsFromLabels(
    beneficiarySocioProfessionalCategoryLabels
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

  const userStructure = await prismaClient.structure.findUnique({
    where: { id: user.structureId }
  })

  if (userStructure?.type === StructureType.Ministere) {
    const ministereStructureData = await getMinistereStructureStatsQuery(
      user.structureId,
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
      await getMinistereDepartementServiceAcStatsQuery(user.structureId, input)
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
  }

  return await createExport(user.id, exportData)
}
