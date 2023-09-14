import { UserActivityType, BeneficiaryDraft } from '@prisma/client'
import {
  ProtectedAppContext,
  ProtectedAppContextUser,
  forbiddenError
} from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import {
  SaveToBeneficiaryInput,
  SaveBeneficiaryGeneralInformationInput
} from '~/server/schema'
import { canSaveToBeneficiaryBeneficiaryDraft } from '~/server/security/rules'
import { generateFileNumber } from '~/utils/generateFileNumber'

export const saveToBeneficiaryHandler = async ({
  input,
  ctx: { user }
}: {
  input: SaveToBeneficiaryInput
  ctx: ProtectedAppContext
}) => {
  const { id: draftId } = input
  const beneficiaryDraft = draftId
    ? await prismaClient.beneficiaryDraft.findUnique({
        where: { id: draftId }
      })
    : undefined

  if (
    beneficiaryDraft &&
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
      await tx.beneficiaryDraft.delete({
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
  input: SaveToBeneficiaryInput,
  beneficiaryDraft?: BeneficiaryDraft | null
) {
  const general = (beneficiaryDraft?.general || input.general) as
    | SaveBeneficiaryGeneralInformationInput
    | undefined

  if (!general) {
    throw new Error(
      'Beneficiary should at least have general information defined.'
    )
  }

  const fileNumber = generateFileNumber()

  const data = {
    structureId: user.structureId,
    fileNumber,
    ...general,
    phone1: general.noPhone ? null : general.phone1,
    phone2: general.noPhone ? null : general.phone2,
    referents: {
      connect: general.referents.map(referent => ({ id: referent }))
    },
    createdById: user.id
  } as any

  return data
}
