import { ProtectedAppContext, notfoundError } from '~/server/trpc'
import { isReferentFor } from '~/server/security/rules/helpers'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { AllowSecurityCheck } from '~/server/security/rules/types'

export const isBeneficiaryReferentSecurityCheck = AllowSecurityCheck

export const isBeneficiaryReferentHandler = async ({
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

  return isReferentFor(user, beneficiary)
}
