import { getBeneficiaryReferentsAndRelatives } from '~/server/query/beneficiaires'
import {
  canEditBeneficiaryExternalOrganisations,
  canEditBeneficiaryGeneralInformation,
  canEditBeneficiaryHealthInfo,
  canEditBeneficiaryOccupationIncome,
  canEditBeneficiaryReferents,
  canEditBeneficiaryRelatives
} from '~/server/security/rules'
import { UpdateBeneficiaryInput } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'

export const updateBeneficiaryHandler = async ({
  input,
  ctx: { user }
}: {
  input: UpdateBeneficiaryInput
  ctx: ProtectedAppContext
}) => {
  const { referents: previousReferents, relatives: previousRelatives } =
    await getBeneficiaryReferentsAndRelatives({
      id: input.id,
      structureId: user.structureId
    })

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
    entourage
  } = input

  let data = {}

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
  if (canEditBeneficiaryGeneralInformation(user, input)) {
    data = { ...data, ...general, aidantConnectAuthorized }
  }
  if (canEditBeneficiaryHealthInfo(user, input)) {
    data = { ...data, ...health }
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

  const beneficiary = await prismaClient.beneficiary.update({
    where: { id },
    data
  })
  return beneficiary
}
