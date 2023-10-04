import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/request'
import {
  SecurityRuleGrantee,
  canEditBeneficiary,
  canEditBeneficiaryReferents
} from '~/server/security/rules'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import {
  UpdateBeneficiaryGeneralInformationInput,
  updateBeneficiaryGeneralInformationSchema
} from '~/server/schema'
import { prepareRelationConnections } from '~/utils/prisma'

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: UpdateBeneficiaryGeneralInformationInput
) => {
  const beneficiary = await getBeneficiarySecurityTarget(input.id)
  return canEditBeneficiary(user, beneficiary)
}

const handler = async ({
  input,
  ctx: { user }
}: {
  input: UpdateBeneficiaryGeneralInformationInput
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(input.id)

  const { referents: previousReferents } = beneficiary

  const previousReferentIds = previousReferents.map(({ id }) => id)

  const {
    id,
    structureId,
    referents: updateReferentIds,
    noPhone,
    phone1,
    phone2,
    ...general
  } = input

  let data = {}
  data = {
    ...general,
    noPhone,
    phone1: noPhone ? null : phone1,
    phone2: noPhone ? null : phone2
  }

  if (
    canEditBeneficiaryReferents(user, {
      structureId,
      referents: previousReferents
    })
  ) {
    const referentConnections = prepareRelationConnections(
      updateReferentIds,
      previousReferentIds
    )

    data = {
      ...data,
      referents: referentConnections
    }
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

export const updateGeneralInformationMutation = createMutation({
  path: 'updateGeneralInformation',
  inputValidation: updateBeneficiaryGeneralInformationSchema,
  securityCheck,
  handler
})
