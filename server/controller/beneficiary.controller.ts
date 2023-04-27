import { AppContext } from '../trpc'
import { createBeneficiary } from '~/server/query/beneficiaires/createBeneficiary'
import { BeneficiaryCreationInput } from '~/server/schema'

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
