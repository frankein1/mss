import { UserActivityType } from '@prisma/client'
import {
  canEditBeneficiary,
  canEditBeneficiaryExternalOrganisations
} from '~/server/security/rules'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { UpdateBeneficiaryExternalOrganisationsInput } from '~/server/schema'

export const updateBeneficiaryExternalOrganisationsHandler = async ({
  input,
  ctx: { user }
}: {
  input: UpdateBeneficiaryExternalOrganisationsInput
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(input.id)

  if (
    !beneficiary ||
    !canEditBeneficiary(user, beneficiary) ||
    !canEditBeneficiaryExternalOrganisations(user, beneficiary)
  ) {
    throw forbiddenError()
  }

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
