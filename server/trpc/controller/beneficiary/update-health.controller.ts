import { UserActivityType } from '@prisma/client'
import {
  SecurityRuleGrantee,
  canEditBeneficiary,
  canEditBeneficiaryHealthInfo,
  canSetBeneficiaryNir
} from '~/server/security/rules'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { UpdateBeneficiaryHealthInput } from '~/server/schema'

export const updateBeneficiaryHealthSecurityCheck = async (
  grantee: SecurityRuleGrantee,
  input: UpdateBeneficiaryHealthInput
) => {
  const beneficiary = await getBeneficiarySecurityTarget(input.id)

  return (
    canEditBeneficiary(grantee, beneficiary) &&
    canEditBeneficiaryHealthInfo(grantee, beneficiary)
  )
}

export const updateBeneficiaryHealthHandler = async ({
  input,
  ctx: { user, structure }
}: {
  input: UpdateBeneficiaryHealthInput
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(input.id)

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
