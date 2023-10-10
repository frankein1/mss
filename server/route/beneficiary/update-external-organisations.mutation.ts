import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  SecurityRuleGrantee,
  canEditBeneficiary,
  canEditBeneficiaryExternalOrganisations
} from '~/server/security/rules'
import { ProtectedAppContext } from '~/server/trpc'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import {
  UpdateBeneficiaryExternalOrganisationsInput,
  updateBeneficiaryExternalOrganisationsSchema
} from '~/server/schema'
import { BeneficiaryRepo } from '~/server/query'

const securityCheck = async (
  grantee: SecurityRuleGrantee,
  input: UpdateBeneficiaryExternalOrganisationsInput
) => {
  const beneficiary = await getBeneficiarySecurityTarget(input.id)
  return (
    canEditBeneficiary(grantee, beneficiary) &&
    canEditBeneficiaryExternalOrganisations(grantee, beneficiary)
  )
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
