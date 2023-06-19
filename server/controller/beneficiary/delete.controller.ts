import { AppContext, forbiddenError, invalidError } from '~/server/trpc'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { canDeleteBeneficiary } from '~/server/security/rules'
import { prismaClient } from '~/server/prisma'

export const deleteBeneficiaryHandler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: AppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(id)

  if (!beneficiary) {
    throw invalidError('Beneficiary not found')
  }

  if (!canDeleteBeneficiary(user, beneficiary)) {
    throw forbiddenError()
  }

  await prismaClient.beneficiary.delete({ where: { id } })
}
