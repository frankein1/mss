import { UserActivityType } from '@prisma/client'
import { createMutation } from '../../request/createRequest'
import {
  SecurityRuleGrantee,
  canEditBeneficiary,
  canEditBeneficiaryExternalOrganisations
} from '~/server/security/rules'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import {
  UpdateBeneficiaryExternalOrganisationsInput,
  updateBeneficiaryExternalOrganisationsSchema
} from '~/server/schema'

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
  const beneficiary = await getBeneficiarySecurityTarget(input.id)

  const { id, ...externalOrganisations } = input

  const updatedBeneficiary = await prismaClient.beneficiary.update({
    where: { id },
    data: externalOrganisations
  })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.UPDATE,
    object: 'Beneficiary',
    objectId: beneficiary.id
  })

  return updatedBeneficiary
}

export const updateExternalOrganisationsMutation = createMutation({
  path: 'updateExternalOrganisations',
  inputValidation: updateBeneficiaryExternalOrganisationsSchema,
  securityCheck,
  handler
})
