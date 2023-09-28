import { UserActivityType } from '@prisma/client'
import {
  canEditBeneficiary,
  canEditBeneficiaryReferents
} from '~/server/security/rules'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { UpdateBeneficiaryTaxHouseholdInput } from '~/server/schema'
import { prepareRelationUpdates } from '~/utils/prisma'

function getBeneficiarySecurityTargetWithTaxHousehold(id: string) {
  return prismaClient.beneficiary.findUnique({
    where: { id },
    select: {
      id: true,
      structureId: true,
      referents: {
        select: { id: true, role: true, structureId: true }
      },
      relatives: {
        include: { linkedBeneficiary: true },
        where: { hosted: true }
      }
    }
  })
}

export const updateBeneficiaryTaxHouseholdHandler = async ({
  input,
  ctx: { user }
}: {
  input: UpdateBeneficiaryTaxHouseholdInput
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTargetWithTaxHousehold(
    input.id
  )

  if (
    !beneficiary ||
    !canEditBeneficiary(user, beneficiary) ||
    !canEditBeneficiaryReferents(user, beneficiary)
  ) {
    throw forbiddenError()
  }

  const { id, structureId: _, taxHouseholds, ...taxHouseholdDatas } = input

  let data = {}
  data = { ...data, ...taxHouseholdDatas }

  const { relatives: previousRelatives } = beneficiary

  const newTaxHouseholds =
    taxHouseholds
      ?.filter(t =>
        // Does not save empty relative
        Object.entries(t).some(([key, value]) => key !== 'id' && !!value)
      )
      .map(e => {
        const { linkedBeneficiary, ...data } = e
        return {
          hosted: true,
          linkedBeneficiaryId: linkedBeneficiary ? linkedBeneficiary.id : null,
          ...data
        }
      }) || []

  const taxHouseholdRelationUpdates = prepareRelationUpdates(
    newTaxHouseholds,
    previousRelatives
  )

  data = {
    ...data,
    relatives: taxHouseholdRelationUpdates
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
