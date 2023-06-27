import {
  ProtectedAppContext,
  forbiddenError,
  notfoundError
} from '~/server/trpc'
import { canViewBeneficiary } from '~/server/security/rules'
import { getBeneficiarySecurityTarget } from '~/server/security'

export const getBeneficiarySecurityTargetHandler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(id)

  if (!beneficiary) {
    throw notfoundError()
  }

  if (!canViewBeneficiary(user, beneficiary)) {
    throw forbiddenError()
  }

  return beneficiary
}
