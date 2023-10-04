import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/request'
import {
  SecurityRuleGrantee,
  canEditBeneficiary,
  canEditBeneficiaryOccupationIncome
} from '~/server/security/rules'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import {
  UpdateBeneficiaryOccupationInput,
  updateBeneficiaryOccupationSchema
} from '~/server/schema'

const securityCheck = async (
  grantee: SecurityRuleGrantee,
  input: UpdateBeneficiaryOccupationInput
) => {
  const beneficiary = await getBeneficiarySecurityTarget(input.id)

  return (
    canEditBeneficiary(grantee, beneficiary) &&
    canEditBeneficiaryOccupationIncome(grantee, beneficiary)
  )
}

const handler = async ({
  input,
  ctx: { user }
}: {
  input: UpdateBeneficiaryOccupationInput
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(input.id)

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

export const updateOccupationIncomeMutation = createMutation({
  path: 'updateOccupationIncome',
  inputValidation: updateBeneficiaryOccupationSchema,
  securityCheck,
  handler
})
