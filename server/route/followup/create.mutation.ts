import { Prisma, FollowupMedium, UserActivityType } from '@prisma/client'
import {
  prepareFollowupTypesMutations,
  prepareMinistryData
} from './helper/prepareFollowupData'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { AddFollowupInput, addFollowupSchema } from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee, canCreateFollowup } from '~/server/security/rules'

import { getBeneficiarySecurityTarget } from '~/server/security'
import { preparePrescribingOrganization } from '~/utils/prescribingOrganization'
import { prepareDocumentsMutations } from '~/utils/document/prepareDocumentMutations'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'

async function prepareFollowupData({
  input,
  transaction,
  ctx: { user, structure }
}: {
  input: AddFollowupInput
  transaction: Prisma.TransactionClient
  ctx: ProtectedAppContext
}): Promise<Prisma.FollowupUncheckedCreateInput> {
  const { type } = await transaction.structure.findUniqueOrThrow({
    where: { id: structure.id },
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
    input.prescribingOrganizationId
  )

  return {
    ...data,
    structureId: structure.id,
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
  ctx: ProtectedAppContext
) {
  const data = await prepareFollowupData({ input, transaction, ctx })

  const fu = await transaction.followup.create({
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

  await addUserActivity({
    transaction,
    userId: ctx.user.id,
    activity: UserActivityType.CREATE,
    object: 'Followup',
    objectId: fu.id
  })
  return fu
}

const handler = ({
  input,
  ctx
}: {
  input: AddFollowupInput
  ctx: ProtectedAppContext
}) => {
  return prismaClient.$transaction(transaction =>
    createTransaction(transaction, input, ctx)
  )
}

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: AddFollowupInput
) => {
  const beneficiary = await getBeneficiarySecurityTarget(
    user,
    input.beneficiaryId
  )
  return canCreateFollowup(user, beneficiary)
}

export const createFollowupMutation = createMutation({
  inputValidation: addFollowupSchema,
  securityCheck,
  handler
})
