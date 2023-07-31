import { getStatLabel } from '~/client/options/stat'
import { beneficiaryGenderLabels } from '~/client/options/beneficiary'
import {
  getBeneficiaryCountQuery,
  getGenderStatsQuery
} from '~/server/query/stats'
import { StatFilterInput } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { STATS_NOT_SPECIFIED_KEY } from '~/utils/constants/stats'
import { createExport } from '~/utils/export/createExport'
import { RowType } from '~/types/export'
import { getPercentage } from '~/utils/stats'

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
    STATS_NOT_SPECIFIED_KEY
  ].map(key => ({
    key,
    header: getStatLabel(beneficiaryGenderLabels, key)
  }))
  const genderRows = [
    genderData.reduce((row: RowType, { _count, gender }) => {
      row[
        gender || STATS_NOT_SPECIFIED_KEY
      ] = `${_count.toString()} (${getPercentage(_count, beneficiaryCount)}%)`
      return row
    }, {})
  ]
  exportData.push({
    name: 'Genres',
    columns: genderColumns,
    rows: genderRows
  })

  return await createExport(user.id, exportData)
}
