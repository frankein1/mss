import { UserActivityType } from '@prisma/client'
import { getBeneficiaryWithRelations } from '~/server/query/beneficiaires'
import {
  canEditBeneficiary,
  canEditBeneficiaryExternalOrganisations,
  canEditBeneficiaryHealthInfo,
  canEditBeneficiaryOccupationIncome,
  canEditBeneficiaryReferents,
  canEditBeneficiaryRelatives,
  canSetBeneficiaryNir
} from '~/server/security/rules'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import {
  getBeneficiarySecurityTarget,
  getUserStructureType
} from '~/server/security'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { UpdateBeneficiaryInput } from '~/server/schema'

export const updateBeneficiaryHandler = async ({
  input,
  ctx: { user }
}: {
  input: UpdateBeneficiaryInput
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(input.id)

  if (!beneficiary || !canEditBeneficiary(user, beneficiary)) {
    throw forbiddenError()
  }

  const { referents: previousReferents, relatives: previousRelatives } =
    await getBeneficiaryWithRelations(input.id)

  const previousIds = previousReferents.map(({ id }) => id)

  const {
    id,
    structureId,
    referents: updateIds,
    aidantConnectAuthorized,
    general,
    health,
    external,
    occupation,
    taxHousehold,
    entourage,
    additionalInformation
  } = input

  let data = {}
  data = { ...general, aidantConnectAuthorized, additionalInformation }

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
  if (canEditBeneficiaryHealthInfo(user, input)) {
    const { socialSecurityNumber, ...otherHealthInfo } = health
    data = { ...data, ...otherHealthInfo }

    const userStructureType = await getUserStructureType(user)

    if (canSetBeneficiaryNir(userStructureType)) {
      data = { ...data, socialSecurityNumber }
    }
  }

  if (canEditBeneficiaryExternalOrganisations(user, input)) {
    data = { ...data, ...external }
  }
  if (canEditBeneficiaryOccupationIncome(user, input)) {
    data = { ...data, ...occupation }
  }
  if (canEditBeneficiaryRelatives(user, input)) {
    const { taxHouseholds: _, ...taxHouseholdDatas } = taxHousehold
    data = { ...data, ...taxHouseholdDatas }
  }

  if (canEditBeneficiaryRelatives(user, input)) {
    const entourages =
      entourage.entourages?.map(e => ({ hosted: false, ...e })) || []
    const taxHouseholds =
      taxHousehold.taxHouseholds?.map(e => {
        const { linkedBeneficiary, ...data } = e
        return {
          hosted: true,
          linkedBeneficiaryId: linkedBeneficiary ? linkedBeneficiary.id : null,
          ...data
        }
      }) || []

    const newRelatives = [...entourages, ...taxHouseholds]

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
