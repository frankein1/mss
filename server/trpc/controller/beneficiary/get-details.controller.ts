import type { Prisma } from '@prisma/client'
import { getBeneficiaryWithRelations } from '~/server/query/beneficiaires'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { canViewBeneficiary } from '~/server/security/rules'
import { getBeneficiaryAccessibleData } from '~/utils/beneficiary/getBeneficiaryAccessibleData'

export const getBeneficiaryDetailsHandler = async ({
  input,
  ctx
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiaryWithRelations(input.id)

  if (!canViewBeneficiary(ctx.user, beneficiary)) {
    throw forbiddenError()
  }

  const beneficiaryAccessibleData = getBeneficiaryAccessibleData(
    ctx,
    beneficiary
  )

  return beneficiaryAccessibleData
}

export type GetBeneficiaryOutput = Prisma.PromiseReturnType<
  typeof getBeneficiaryDetailsHandler
>['beneficiary']
