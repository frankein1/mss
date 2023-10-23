import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { SecurityRuleGrantee } from '~/server/security/rules'
import { ProtectedAppContext } from '~/server/trpc'
import { getBeneficiarySecurityTarget } from '~/server/query'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import {
  UpdateBeneficiaryOccupationInput,
  updateBeneficiaryOccupationSchema
} from '~/server/schema'
import { BeneficiaryRepo } from '~/server/database'
import { BeneficiaryRules } from '~/server/security'

const securityCheck = async (
  grantee: SecurityRuleGrantee,
  input: UpdateBeneficiaryOccupationInput
) => {
  const beneficiary = await getBeneficiarySecurityTarget(grantee, input.id)
  return BeneficiaryRules.update.occupationIncome(grantee, beneficiary)
}

const handler = async ({
  input,
  ctx: { user }
}: {
  input: UpdateBeneficiaryOccupationInput
  ctx: ProtectedAppContext
}) => {
  const { id, ...occupation } = input

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    where: { id },
    data: occupation
  })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.UPDATE,
    object: 'Beneficiary',
    objectId: id
  })

  return updatedBeneficiary
}

export const updateOccupationIncomeMutation = createMutation({
  inputValidation: updateBeneficiaryOccupationSchema,
  securityCheck,
  handler
})
