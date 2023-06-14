import { getBeneficiaryReferentsAndRelatives } from '~/server/query/beneficiaires'
import { AppContext, forbiddenError } from '~/server/trpc'
import { canViewBeneficiary } from '~/server/security/rules'

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

  if (!canViewBeneficiary(user, beneficiary)) {
    throw forbiddenError()
  }
  const { relatives, ...beneficiaryData } = beneficiary
  // TODO: split beneficiary data ?

  const taxHouseholds = (relatives || []).filter(relative => relative.hosted)
  const entourages = (relatives || []).filter(relative => !relative.hosted)

  return { beneficiary: beneficiaryData, taxHouseholds, entourages }
}
