import { ProtectedAppContext } from '~/server/trpc'
import {
  SecurityRuleGrantee,
  canViewBeneficiary
} from '~/server/security/rules'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { IdInput } from '~/server/schema'

export const getBeneficiarySecurityTargetSecurityCheck = async (
  grantee: SecurityRuleGrantee,
  input: IdInput
) => {
  const beneficiary = await getBeneficiarySecurityTarget(input.id)

  return canViewBeneficiary(grantee, beneficiary)
}

export const getBeneficiarySecurityTargetHandler = async ({
  input: { id },
  ctx: _ctx
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(id)

  return beneficiary
}
