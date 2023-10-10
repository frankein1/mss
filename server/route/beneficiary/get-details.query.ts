import type { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { getBeneficiaryWithRelations } from '~/server/query/beneficiaires'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SecurityRuleGrantee,
  canViewBeneficiary
} from '~/server/security/rules'
import { getBeneficiaryAccessibleData } from '~/server/route/beneficiary/helper/getBeneficiaryAccessibleData'
import { IdInput, idSchema } from '~/server/schema'
import { getBeneficiarySecurityTarget } from '~/server/security'

const securityCheck = async (grantee: SecurityRuleGrantee, input: IdInput) => {
  const beneficiary = await getBeneficiarySecurityTarget(grantee, input.id)

  return canViewBeneficiary(grantee, beneficiary)
}

const handler = async ({
  input,
  ctx
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiaryWithRelations(ctx.user, input.id)

  const beneficiaryAccessibleData = getBeneficiaryAccessibleData(
    ctx,
    beneficiary
  )

  return beneficiaryAccessibleData
}

export type GetBeneficiaryOutput = Prisma.PromiseReturnType<
  typeof handler
>['beneficiary']

export const getBeneficiaryDetailsQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
