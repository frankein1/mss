import { createQuery } from '~/server/route'
import { ProtectedAppContext, notfoundError } from '~/server/trpc'
import { isReferentFor, AllowSecurityCheck } from '~/server/security'
import { getBeneficiarySecurityTarget } from '~/server/query'
import { idSchema } from '~/server/schema'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(user, id)

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
