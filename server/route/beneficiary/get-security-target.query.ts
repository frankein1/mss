import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { getBeneficiarySecurityTarget } from '~/server/query'
import { idSchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input: { id },
  ctx
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(ctx.user, id)

  return beneficiary
}

export const getBeneficiarySecurityTargetQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
