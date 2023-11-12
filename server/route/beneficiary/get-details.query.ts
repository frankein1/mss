import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  BeneficiaryEditPermission,
  SecurityRuleGrantee,
  canViewBeneficiaryGeneral,
  getBeneficiaryEditPermissions
} from '~/server/security'
import { IdInput, idSchema } from '~/server/schema'
import { findBeneficiary, getBeneficiarySecurityTarget } from '~/server/query'

const securityCheck = async (grantee: SecurityRuleGrantee, input: IdInput) => {
  const beneficiary = await getBeneficiarySecurityTarget(grantee, input.id)

  return canViewBeneficiaryGeneral(grantee, beneficiary)
}

const handler = async ({
  input,
  ctx
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const { user, structure } = ctx

  const target = await getBeneficiarySecurityTarget(user, input.id)

  const permissions: BeneficiaryEditPermission = getBeneficiaryEditPermissions({
    user,
    target,
    structure
  })
  const beneficiary = await findBeneficiary({
    user,
    structure,
    id: input.id
  })

  return { beneficiary, permissions }
}

export const getBeneficiaryDetailsQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
