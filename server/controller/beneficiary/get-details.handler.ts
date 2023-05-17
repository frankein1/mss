import { getBeneficiaryReferentsAndRelatives } from '~/server/query/beneficiaires'
import { AppContext } from '~/server/trpc'

export const getBeneficiaryDetailsHandler = async ({
  input,
  ctx: { user }
}: {
  input: { id: string }
  ctx: AppContext
}) => {
  const beneficiary = await getBeneficiaryReferentsAndRelatives({
    id: input.id,
    structureId: user.structureId
  })
  const { relatives, ...beneficiaryData } = beneficiary

  const taxHouseholds = (relatives || []).filter(relative => relative.hosted)
  const entourages = (relatives || []).filter(relative => !relative.hosted)

  return { beneficiary: beneficiaryData, taxHouseholds, entourages }
}
