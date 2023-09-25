import { UserActivityType } from '@prisma/client'
import { getBeneficiaryWithRelations } from '~/server/query/beneficiaires'
import {
  canEditBeneficiary,
  canEditBeneficiaryReferents
} from '~/server/security/rules'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { UpdateBeneficiaryGeneralInformationInput } from '~/server/schema'

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

  const { referents: previousReferents } = await getBeneficiaryWithRelations(
    input.id
  )

  const previousIds = previousReferents.map(({ id }) => id)

  const {
    id,
    structureId,
    referents: updateIds,
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
    const newIds =
      updateIds.filter(updateId => !previousIds.includes(updateId)) || []
    const trashIds = previousIds.filter(id => !updateIds.includes(id)) || []

    const createIds = newIds.map(id => ({
      id
    }))
    const deleteIds = trashIds.map(id => ({
      id
    }))

    data = {
      ...data,
      referents: {
        connect: createIds,
        disconnect: deleteIds
      }
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
