import { createQuery } from '~/server/request'
import { ProtectedAppContext, notfoundError } from '~/server/trpc'
import { isReferentFor } from '~/server/security/rules/helpers'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { idSchema } from '~/server/schema'

const securityCheck = AllowSecurityCheck

const handler = async ({
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

export const isBeneficiaryReferentQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
