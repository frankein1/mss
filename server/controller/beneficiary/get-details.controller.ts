import type { Prisma } from '@prisma/client'
import { getBeneficiaryReferentsAndRelatives } from '~/server/query/beneficiaires'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { canViewBeneficiary } from '~/server/security/rules'
import { getBeneficiaryAccessibleData } from '~/utils/beneficiary/getBeneficiaryAccessibleData'

export const getBeneficiaryDetailsHandler = async ({
  input,
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiaryReferentsAndRelatives(input.id)

  if (!canViewBeneficiary(user, beneficiary)) {
    throw forbiddenError()
  }

  const beneficiaryAccessibleData = await getBeneficiaryAccessibleData(
    user,
    beneficiary
  )

  return beneficiaryAccessibleData
}

export type GetBeneficiaryOutput = Prisma.PromiseReturnType<
  typeof getBeneficiaryDetailsHandler
>['beneficiary']
