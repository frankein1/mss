import { UserActivityType } from '@prisma/client'
import {
  canEditBeneficiary,
  canEditBeneficiaryHealthInfo,
  canSetBeneficiaryNir
} from '~/server/security/rules'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { UpdateBeneficiaryHealthInput } from '~/server/schema'

export const updateBeneficiaryHealthHandler = async ({
  input,
  ctx: { user, structure }
}: {
  input: UpdateBeneficiaryHealthInput
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(input.id)

  if (
    !beneficiary ||
    !canEditBeneficiary(user, beneficiary) ||
    !canEditBeneficiaryHealthInfo(user, beneficiary)
  ) {
    throw forbiddenError()
  }

  const { id, socialSecurityNumber, ...health } = input

  let data = {}
  data = { ...data, ...health }

  if (canSetBeneficiaryNir(structure.type)) {
    data = { ...data, socialSecurityNumber }
  }

  const updatedBeneficiary = await prismaClient.beneficiary.update({
    where: { id },
    data
  })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.UPDATE,
    object: 'Beneficiary',
    objectId: beneficiary.id
  })

  return updatedBeneficiary
}
