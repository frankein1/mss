import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SecurityRuleGrantee,
  canViewBeneficiary
} from '~/server/security/rules'
import { getBeneficiarySecurityTarget } from '~/server/query'
import { IdInput, idSchema } from '~/server/schema'

const securityCheck = async (grantee: SecurityRuleGrantee, input: IdInput) => {
  const beneficiary = await getBeneficiarySecurityTarget(grantee, input.id)

  return canViewBeneficiary(grantee, beneficiary)
}

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
