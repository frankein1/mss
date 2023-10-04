import { UserActivityType } from '@prisma/client'
import {
  SecurityRuleGrantee,
  canEditBeneficiary,
  canEditBeneficiaryExternalOrganisations
} from '~/server/security/rules'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { UpdateBeneficiaryExternalOrganisationsInput } from '~/server/schema'

export const updateBeneficiaryExternalOrganisationsSecurityCheck = async (
  grantee: SecurityRuleGrantee,
  input: UpdateBeneficiaryExternalOrganisationsInput
) => {
  const beneficiary = await getBeneficiarySecurityTarget(input.id)
  return (
    canEditBeneficiary(grantee, beneficiary) &&
    canEditBeneficiaryExternalOrganisations(grantee, beneficiary)
  )
}

export const updateBeneficiaryExternalOrganisationsHandler = async ({
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
