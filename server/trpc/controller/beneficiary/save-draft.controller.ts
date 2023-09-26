import { UserActivityType, Prisma } from '@prisma/client'
import {
  ProtectedAppContext,
  ProtectedAppContextUser,
  forbiddenError
} from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import {
  SaveDraftInput,
  SaveBeneficiaryGeneralInformationInput,
  SaveBeneficiaryTaxHouseholdInput
} from '~/server/schema'
import {
  canSaveToBeneficiaryBeneficiaryDraft,
  canEditBeneficiaryRelatives
} from '~/server/security/rules'
import { generateFileNumber } from '~/utils/generateFileNumber'
import { BeneficiaryDraft } from '~/types/beneficiary'

export const saveDraftHandler = async ({
  input,
  ctx: { user }
}: {
  input: SaveDraftInput
  ctx: ProtectedAppContext
}) => {
  const { id: draftId } = input
  const beneficiaryDraft = draftId
    ? await prismaClient.draft.findUnique({
        where: { id: draftId }
      })
    : undefined

  if (
    !beneficiaryDraft ||
    !canSaveToBeneficiaryBeneficiaryDraft(user, beneficiaryDraft)
  ) {
    throw forbiddenError()
  }

  const data = prepareData(user, input, beneficiaryDraft)

  return await prismaClient.$transaction(async tx => {
    const { id } = await tx.beneficiary.create({
      data
    })

    await addUserActivity({
      userId: user.id,
      activity: UserActivityType.CREATE,
      object: 'Beneficiary',
      objectId: id,
      transaction: tx
    })

    if (beneficiaryDraft) {
      await tx.draft.delete({
        where: {
          id: draftId
        }
      })
    }

    return { id }
  })
}

function prepareData(
  user: ProtectedAppContextUser,
  input: SaveDraftInput,
  beneficiaryDraft: BeneficiaryDraft
) {
  const { general, taxHousehold } = getDataFromSources(input, beneficiaryDraft)

  if (!general) {
    throw new Error(
      'Beneficiary should at least have general information defined.'
    )
  }

  const fileNumber = generateFileNumber()

  let data = {
    structureId: user.structureId,
    fileNumber,
    ...general,
    phone1: general.noPhone ? null : general.phone1,
    phone2: general.noPhone ? null : general.phone2,
    referents: {
      connect: general.referents.map(referent => ({ id: referent }))
    },
    createdById: user.id
  } as Prisma.BeneficiaryUncheckedCreateInput

  if (
    taxHousehold &&
    canEditBeneficiaryRelatives(user, {
      structureId: user.structureId,
      referents: general.referents
    })
  ) {
    const { taxHouseholds, ...taxHouseholdDatas } = taxHousehold

    const newRelatives =
      taxHouseholds?.map(e => {
        const { linkedBeneficiary, ...data } = e
        return {
          hosted: true,
          linkedBeneficiaryId: linkedBeneficiary ? linkedBeneficiary.id : null,
          ...data
        }
      }) || []

    data = {
      ...data,
      ...taxHouseholdDatas,
      relatives: {
        create: newRelatives
      }
    }
  }

  return data
}

function getDataFromSources(
  input: SaveDraftInput,
  beneficiaryDraft: BeneficiaryDraft
) {
  const general = (input.general || beneficiaryDraft.content?.general) as
    | SaveBeneficiaryGeneralInformationInput
    | undefined
  const taxHousehold = (input.taxHousehold ||
    beneficiaryDraft.content?.taxHousehold) as
    | SaveBeneficiaryTaxHouseholdInput
    | undefined

  return { general, taxHousehold }
}
