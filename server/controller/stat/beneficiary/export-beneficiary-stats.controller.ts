import { getStatLabel } from '~/client/options/stat'
import { beneficiaryGenderLabels } from '~/client/options/beneficiary'
import {
  getBeneficiaryCountQuery,
  getGenderStatsQuery,
  getAgeStatsQuery
} from '~/server/query/stats'
import { StatFilterInput } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { STATS_NULL_KEY } from '~/utils/constants/stats'
import { createExport } from '~/utils/export/createExport'
import { RowType } from '~/types/export'
import { getPercentage } from '~/utils/stats'
import { ageGroupLabels } from '~/client/options/ageGroup'

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
  const genderColumns = [
    ...Object.keys(beneficiaryGenderLabels),
    STATS_NULL_KEY
  ].map(key => ({
    key,
    header: getStatLabel(beneficiaryGenderLabels, key)
  }))
  const genderRows = [
    genderData.reduce((row: RowType, { _count, gender }) => {
      row[gender || STATS_NULL_KEY] = _count.toString()
      return row
    }, {}),
    genderData.reduce((row: RowType, { _count, gender }) => {
      row[gender || STATS_NULL_KEY] = `${getPercentage(
        _count,
        beneficiaryCount
      )}%`
      return row
    }, {})
  ]
  exportData.push({
    name: 'Genres',
    columns: genderColumns,
    rows: genderRows
  })

  const ageData = await getAgeStatsQuery(user.structureId, input)
  const ageColumns = [...Object.keys(ageGroupLabels), STATS_NULL_KEY].map(
    key => ({
      key,
      header: getStatLabel(ageGroupLabels, key)
    })
  )
  const ageRows = [
    ageData.reduce((row: RowType, { _count, ageGroup }) => {
      row[ageGroup || STATS_NULL_KEY] = _count.toString()
      return row
    }, {}),
    ageData.reduce((row: RowType, { _count, ageGroup }) => {
      row[ageGroup || STATS_NULL_KEY] = `${getPercentage(
        _count,
        beneficiaryCount
      )}%`
      return row
    }, {})
  ]
  exportData.push({
    name: "Tranches d'âge",
    columns: ageColumns,
    rows: ageRows
  })

  return await createExport(user.id, exportData)
}
