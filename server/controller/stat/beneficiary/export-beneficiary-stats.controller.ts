import {
  beneficiaryAccommodationZoneLabels,
  beneficiaryGenderLabels
} from '~/client/options/beneficiary'
import { familySituationLabels } from '~/client/options/familySituation'
import {
  getBeneficiaryCountQuery,
  getGenderStatsQuery,
  getAgeStatsQuery,
  getFamilyStatsQuery,
  getRegionStatsQuery,
  getAccommodationZoneStatsQuery
} from '~/server/query/stats'
import { StatFilterInput } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'
import { ageGroupLabels } from '~/client/options/ageGroup'
import { getColumnsFromLabels } from '~/utils/export/getColumnsFromLabels'
import { getRowsFromData } from '~/utils/export/getRowsFromData'
import { STATS_NULL_KEY } from '~/utils/constants/stats'
import { STATS_NULL_LABEL } from '~/client/options/stat'

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

  return await createExport(user.id, exportData)
}
