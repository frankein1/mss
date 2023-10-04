import type { Prisma } from '@prisma/client'
import { getBeneficiaryWithRelations } from '~/server/query/beneficiaires'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SecurityRuleGrantee,
  canViewBeneficiary
} from '~/server/security/rules'
import { getBeneficiaryAccessibleData } from '~/utils/beneficiary/getBeneficiaryAccessibleData'
import { IdInput } from '~/server/schema'
import { getBeneficiarySecurityTarget } from '~/server/security'

export const getBeneficiaryDetailsSecurityCheck = async (
  grantee: SecurityRuleGrantee,
  input: IdInput
) => {
  const beneficiary = await getBeneficiarySecurityTarget(input.id)

  return canViewBeneficiary(grantee, beneficiary)
}

export const getBeneficiaryDetailsHandler = async ({
  input,
  ctx
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiaryWithRelations(input.id)

  const beneficiaryAccessibleData = getBeneficiaryAccessibleData(
    ctx,
    beneficiary
  )

  return beneficiaryAccessibleData
}

export type GetBeneficiaryOutput = Prisma.PromiseReturnType<
  typeof getBeneficiaryDetailsHandler
>['beneficiary']
