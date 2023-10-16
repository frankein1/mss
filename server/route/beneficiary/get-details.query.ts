import type { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { getBeneficiaryWithRelations } from '~/server/query/beneficiaires'
import { ProtectedAppContext } from '~/server/trpc'
import { getBeneficiaryAccessibleData } from '~/server/route/beneficiary/helper/getBeneficiaryAccessibleData'
import { idSchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'

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
  securityCheck: AllowSecurityCheck,
  handler
})
