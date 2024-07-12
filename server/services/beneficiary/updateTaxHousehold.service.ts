import { BeneficiaryRepo } from '~/server/database'
import { UpdateBeneficiaryTaxHouseholdInput } from '~/server/schema'
import { isSeparate, isMarried } from '~/utils/beneficiary'

export async function updateTaxHousehold(
  input: UpdateBeneficiaryTaxHouseholdInput
) {
  const { id: beneficiaryId, ...taxHouseholdDatas } = cleanInput(input)

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    where: { id: beneficiaryId },
    data: {
      ...taxHouseholdDatas
    }
  })

  return updatedBeneficiary
}

function cleanInput(input: UpdateBeneficiaryTaxHouseholdInput) {
  if (!isSeparate(input.familySituation)) {
    input.divorceDate = null
  }
  if (!isMarried(input.familySituation)) {
    input.weddingDate = null
  }
  return input
}
