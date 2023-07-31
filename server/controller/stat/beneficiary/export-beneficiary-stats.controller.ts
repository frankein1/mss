import { beneficiaryGenderLabels } from '~/client/options/beneficiary'
import {
  getBeneficiaryCountQuery,
  getGenderStatsQuery,
  getAgeStatsQuery
} from '~/server/query/stats'
import { StatFilterInput } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'
import { ageGroupLabels } from '~/client/options/ageGroup'
import { getColumnsFromLabels } from '~/utils/export/getColumnsFromLabels'
import { getRowsFromData } from '~/utils/export/getRowsFromData'

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

  return await createExport(user.id, exportData)
}
