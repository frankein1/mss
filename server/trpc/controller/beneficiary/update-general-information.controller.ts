import { UserActivityType } from '@prisma/client'
import {
  canEditBeneficiary,
  canEditBeneficiaryReferents
} from '~/server/security/rules'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { UpdateBeneficiaryGeneralInformationInput } from '~/server/schema'
import { prepareRelationConnections } from '~/utils/prisma'

export const updateBeneficiaryGeneralInformationHandler = async ({
  input,
  ctx: { user }
}: {
  input: UpdateBeneficiaryGeneralInformationInput
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(input.id)

  if (!beneficiary || !canEditBeneficiary(user, beneficiary)) {
    throw forbiddenError()
  }

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
