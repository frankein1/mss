import { UserActivityType } from '@prisma/client'
import {
  canEditBeneficiary,
  canEditBeneficiaryOccupationIncome
} from '~/server/security/rules'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { UpdateBeneficiaryOccupationInput } from '~/server/schema'

export const updateBeneficiaryOccupationIncomeHandler = async ({
  input,
  ctx: { user }
}: {
  input: UpdateBeneficiaryOccupationInput
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(input.id)

  if (
    !beneficiary ||
    !canEditBeneficiary(user, beneficiary) ||
    !canEditBeneficiaryOccupationIncome(user, beneficiary)
  ) {
    throw forbiddenError()
  }

  const { id, ...occupation } = input

  const updatedBeneficiary = await prismaClient.beneficiary.update({
    where: { id },
    data: occupation
  })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.UPDATE,
    object: 'Beneficiary',
    objectId: beneficiary.id
  })

  return updatedBeneficiary
}
