import { Prisma, User, FollowupMedium } from '@prisma/client'
import {
  ProtectedAppContext,
  invalidError,
  forbiddenError
} from '~/server/trpc'
import type { AddFollowupInput } from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import { canCreateFollowup } from '~/server/security/rules'
import {
  prepareMinistryData,
  prepareFollowupTypesMutations
} from '~/utils/followup'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { preparePrescribingOrganization } from '~/utils/prescribingOrganization/preparePrescribingOrganization'
import { prepareDocumentsMutations } from '~/utils/document/prepareDocumentMutations'

export async function prepareFollowupData({
  input,
  transaction,
  user
}: {
  input: AddFollowupInput
  transaction: Prisma.TransactionClient
  user: User
}): Promise<Prisma.FollowupUncheckedCreateInput> {
  const { structureId } = await transaction.beneficiary.findUniqueOrThrow({
    where: { id: input.beneficiaryId },
    select: { structureId: true }
  })

  const { type } = await transaction.structure.findUniqueOrThrow({
    where: { id: structureId },
    select: {
      type: true
    }
  })

  const {
    ActionLogement,
    Bailleur,
    DeetsSiao,
    Prefecture,
    SecoursMedecinTraitant,
    ChefCabinet,
    OrganismeMenace,
    Prefet,
    ...data
  } = input

  const ministryData = prepareMinistryData(
    type,
    { ActionLogement, Bailleur, DeetsSiao, Prefecture, SecoursMedecinTraitant },
    { ChefCabinet, OrganismeMenace, Prefet },
    data
  )

  const prescribingOrganizationId = await preparePrescribingOrganization(
    transaction,
    user,
    structureId,
    input.prescribingOrganizationId
  )

  return {
    ...data,
    structureId,
    types: prepareFollowupTypesMutations(input.types),
    documents: prepareDocumentsMutations(input.documents),
    createdById: user.id,
    place:
      input.medium === FollowupMedium.ExternalAppointment ? input.place : null,
    thirdPersonName:
      input.medium === FollowupMedium.ThirdParty ? input.thirdPersonName : null,
    structureName: input.redirected ? input.structureName : null,
    prescribingOrganizationId,
    ...ministryData
  }
}

async function createTransaction(
  transaction: Prisma.TransactionClient,
  input: AddFollowupInput,
  user: User
) {
  const data = await prepareFollowupData({ input, transaction, user })

  return await transaction.followup.create({
    data,
    include: {
      beneficiary: {
        select: {
          id: true,
          fileNumber: true
        }
      }
    }
  })
}

export const addFollowupHandler = async ({
  input,
  ctx: { user }
}: {
  input: AddFollowupInput
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(input.beneficiaryId)

  if (!beneficiary) {
    throw invalidError('Beneficiary not found')
  }

  if (!canCreateFollowup(user, beneficiary)) {
    throw forbiddenError()
  }

  return prismaClient.$transaction(transaction =>
    createTransaction(transaction, input, user)
  )
}
