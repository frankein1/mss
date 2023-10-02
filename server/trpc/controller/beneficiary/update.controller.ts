import { UserActivityType } from '@prisma/client'
import { getBeneficiaryWithRelations } from '~/server/query/beneficiaires'
import {
  canEditBeneficiary,
  canEditBeneficiaryExternalOrganisations,
  canEditBeneficiaryHealthInfo,
  canEditBeneficiaryOccupationIncome,
  canEditBeneficiaryRelatives,
  canSetBeneficiaryNir
} from '~/server/security/rules'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { UpdateBeneficiaryInput } from '~/server/schema'

export const updateBeneficiaryHandler = async ({
  input,
  ctx: { user, structure }
}: {
  input: UpdateBeneficiaryInput
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(input.id)

  if (!beneficiary || !canEditBeneficiary(user, beneficiary)) {
    throw forbiddenError()
  }

  const { relatives: previousRelatives } = await getBeneficiaryWithRelations(
    input.id
  )

  const { id, health, external, occupation, entourage } = input

  let data = {}

  if (
    canEditBeneficiaryHealthInfo(user, {
      ...input,
      referents: beneficiary.referents
    })
  ) {
    const { socialSecurityNumber, ...otherHealthInfo } = health
    data = { ...data, ...otherHealthInfo }

    if (canSetBeneficiaryNir(structure.type)) {
      data = { ...data, socialSecurityNumber }
    }
  }

  if (
    canEditBeneficiaryExternalOrganisations(user, {
      ...input,
      referents: beneficiary.referents
    })
  ) {
    data = { ...data, ...external }
  }
  if (
    canEditBeneficiaryOccupationIncome(user, {
      ...input,
      referents: beneficiary.referents
    })
  ) {
    data = { ...data, ...occupation }
  }

  if (
    canEditBeneficiaryRelatives(user, {
      ...input,
      referents: beneficiary.referents
    })
  ) {
    const entourages =
      entourage.entourages?.map(e => ({ hosted: false, ...e })) || []
    // const taxHouseholds =
    //   taxHousehold.taxHouseholds?.map(e => {
    //     const { linkedBeneficiary, ...data } = e
    //     return {
    //       hosted: true,
    //       linkedBeneficiaryId: linkedBeneficiary ? linkedBeneficiary.id : null,
    //       ...data
    //     }
    //   }) || []

    // const newRelatives = [...entourages, ...taxHouseholds]
    const newRelatives = [...entourages]

    const createRelatives =
      newRelatives.filter(
        ({ id }) => !previousRelatives.map(({ id }) => id).includes(id)
      ) || []
    const trashRelatives =
      previousRelatives.filter(
        ({ id }) => !newRelatives.map(({ id }) => id).includes(id)
      ) || []
    const updateRelatives =
      newRelatives.filter(({ id }) =>
        previousRelatives.map(({ id }) => id).includes(id)
      ) || []

    data = {
      ...data,
      relatives: {
        create: createRelatives,
        delete: trashRelatives.map(({ id }) => ({ id })),
        update: updateRelatives.map(({ id, ...data }) => ({
          where: { id },
          data
        }))
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
