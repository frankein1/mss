import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { SecurityRuleGrantee, BeneficiaryRules } from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import { getBeneficiarySecurityTarget } from '~/server/query'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import {
  UpdateBeneficiaryHealthInput,
  updateBeneficiaryHealthSchema
} from '~/server/schema'
import { BeneficiaryRepo } from '~/server/database'

const securityCheck = async (
  grantee: SecurityRuleGrantee,
  input: UpdateBeneficiaryHealthInput
) => {
  const beneficiary = await getBeneficiarySecurityTarget(grantee, input.id)
  return BeneficiaryRules.update.healthInfo(grantee, beneficiary)
}

const handler = async ({
  input,
  ctx: { user, structure }
}: {
  input: UpdateBeneficiaryHealthInput
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(user, input.id)

  const { id, socialSecurityNumber, ...health } = input

  let data = {}
  data = { ...data, ...health }

  if (BeneficiaryRules.update.healthInfoNir(structure.type)) {
    data = { ...data, socialSecurityNumber }
  }

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
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

export const updateHealthMutation = createMutation({
  inputValidation: updateBeneficiaryHealthSchema,
  securityCheck,
  handler
})
