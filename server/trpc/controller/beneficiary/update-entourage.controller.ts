import { UserActivityType } from '@prisma/client'
import {
  canEditBeneficiary,
  canEditBeneficiaryReferents
} from '~/server/security/rules'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { UpdateBeneficiaryEntourageInput } from '~/server/schema'
import { prepareRelationUpdates } from '~/utils/prisma'

function getBeneficiarySecurityTargetWithEntourage(id: string) {
  return prismaClient.beneficiary.findUnique({
    where: { id },
    select: {
      id: true,
      structureId: true,
      referents: {
        select: { id: true, role: true, structureId: true }
      },
      relatives: {
        where: { hosted: false }
      }
    }
  })
}

export const updateBeneficiaryEntourageHandler = async ({
  input,
  ctx: { user }
}: {
  input: UpdateBeneficiaryEntourageInput
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTargetWithEntourage(input.id)

  if (
    !beneficiary ||
    !canEditBeneficiary(user, beneficiary) ||
    !canEditBeneficiaryReferents(user, beneficiary)
  ) {
    throw forbiddenError()
  }

  const { id, entourages } = input

  let data = {}

  const { relatives: previousRelatives } = beneficiary

  const newEntourages =
    entourages
      ?.filter(e =>
        // Does not save empty relative
        Object.entries(e).some(([key, value]) => key !== 'id' && !!value)
      )
      .map(e => {
        return {
          hosted: false,
          ...e
        }
      }) || []

  const entouragesRelationUpdates = prepareRelationUpdates(
    newEntourages,
    previousRelatives
  )

  data = {
    ...data,
    relatives: entouragesRelationUpdates
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
