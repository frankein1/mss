import { Prisma, User, FollowupMedium } from '@prisma/client'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import type { EditFollowupInput } from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import {
  canEditFollowup,
  canEditFollowupPrivateSynthesis
} from '~/server/security/rules'
import {
  FollowupTarget,
  prepareMinistryData,
  prepareFollowupTypesMutations
} from '~/utils/followup/prepareFollowupData'
import { preparePrescribingOrganization } from '~/utils/prescribingOrganization/preparePrescribingOrganization'
import { prepareDocumentsMutations } from '~/utils/document/prepareDocumentMutations'
import {
  FollowupWithBeneficiaryDocumentsAndTypes,
  getFollowupWithBeneficiaryDocumentsAndTypes
} from '~/server/query/followups'

export async function prepareFollowupData({
  input,
  transaction,
  user,
  target
}: {
  input: EditFollowupInput
  transaction: Prisma.TransactionClient
  user: User
  target: FollowupTarget
}): Promise<Prisma.FollowupUncheckedUpdateInput> {
  const { structureId } = target.beneficiary

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
    types: prepareFollowupTypesMutations(input.types, target.types),
    documents: prepareDocumentsMutations(input.documents, target.documents),
    place:
      input.medium === FollowupMedium.ExternalAppointment ? input.place : null,
    thirdPersonName:
      input.medium === FollowupMedium.ThirdParty ? input.thirdPersonName : null,
    privateSynthesis: canEditFollowupPrivateSynthesis(user, target)
      ? input.privateSynthesis
      : undefined,
    structureName: input.redirected ? input.structureName : null,
    prescribingOrganizationId,
    ...ministryData
  }
}

async function updateTransaction(
  transaction: Prisma.TransactionClient,
  input: EditFollowupInput,
  user: User,
  target: Exclude<FollowupWithBeneficiaryDocumentsAndTypes, null>
) {
  const data = await prepareFollowupData({
    input,
    transaction,
    user,
    target
  })

  return await transaction.followup.update({
    where: { id: input.id },
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

export const updateFollowupHandler = async ({
  input,
  ctx: { user }
}: {
  input: EditFollowupInput
  ctx: ProtectedAppContext
}) => {
  const target = await getFollowupWithBeneficiaryDocumentsAndTypes(input.id)

  if (!target || !canEditFollowup(user, target)) {
    throw forbiddenError()
  }

  return prismaClient.$transaction(transaction =>
    updateTransaction(transaction, input, user, target)
  )
}
