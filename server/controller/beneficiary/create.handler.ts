import { createBeneficiary } from '~/server/query/beneficiaires'
import { BeneficiaryCreationInput } from '~/server/schema'
import { AppContext } from '~/server/trpc'

export const createBeneficiaryHandler = async ({
  input,
  ctx: { user }
}: {
  input: BeneficiaryCreationInput
  ctx: AppContext
}) => {
  const beneficiary = await createBeneficiary(input, user)

  return beneficiary
}
