import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  SecurityRuleGrantee,
  canEditBeneficiaryExternalOrganisations
} from '~/server/security/rules'
import { ProtectedAppContext } from '~/server/trpc'
import { getBeneficiarySecurityTarget } from '~/server/query'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import {
  UpdateBeneficiaryExternalOrganisationsInput,
  updateBeneficiaryExternalOrganisationsSchema
} from '~/server/schema'
import { BeneficiaryRepo } from '~/server/repository'

const securityCheck = async (
  grantee: SecurityRuleGrantee,
  input: UpdateBeneficiaryExternalOrganisationsInput
) => {
  const beneficiary = await getBeneficiarySecurityTarget(grantee, input.id)
  return canEditBeneficiaryExternalOrganisations(grantee, beneficiary)
}

const handler = async ({
  input,
  ctx: { user }
}: {
  input: UpdateBeneficiaryExternalOrganisationsInput
  ctx: ProtectedAppContext
}) => {
  const { id, ...externalOrganisations } = input

  const updatedBeneficiary = await BeneficiaryRepo.update(user, {
    where: { id },
    data: externalOrganisations
  })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.UPDATE,
    object: 'Beneficiary',
    objectId: id
  })

  return updatedBeneficiary
}

export const updateExternalOrganisationsMutation = createMutation({
  inputValidation: updateBeneficiaryExternalOrganisationsSchema,
  securityCheck,
  handler
})
