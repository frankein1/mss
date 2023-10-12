import { Prisma, FollowupMedium, UserActivityType } from '@prisma/client'
import {
  FollowupTarget,
  prepareFollowupTypesMutations,
  prepareMinistryData
} from './helper/prepareFollowupData'
import { createMutation } from '~/server/route'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { EditFollowupInput, editFollowupSchema } from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import {
  SecurityRuleGrantee,
  canEditFollowup,
  canEditFollowupPrivateSynthesis
} from '~/server/security/rules'

import { preparePrescribingOrganization } from '~/utils/prescribingOrganization'
import { prepareDocumentsMutations } from '~/utils/document/prepareDocumentMutations'
import {
  FollowupWithRelations,
  getFollowupSecurityTarget,
  getFollowupWithRelations
} from '~/server/query/followups'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'

async function prepareFollowupData({
  input,
  transaction,
  ctx,
  target
}: {
  input: EditFollowupInput
  transaction: Prisma.TransactionClient
  ctx: ProtectedAppContext
  target: FollowupTarget
}): Promise<Prisma.FollowupUncheckedUpdateInput> {
  const { structure, user } = ctx
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
  ctx: ProtectedAppContext,
  target: Exclude<FollowupWithRelations, null>
) {
  const data = await prepareFollowupData({
    input,
    transaction,
    ctx,
    target
  })

  const fu = await transaction.followup.update({
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

  await addUserActivity({
    transaction,
    userId: ctx.user.id,
    activity: UserActivityType.UPDATE,
    object: 'Followup',
    objectId: input.id
  })
  return fu
}

const handler = async ({
  input,
  ctx
}: {
  input: EditFollowupInput
  ctx: ProtectedAppContext
}) => {
  const target = await getFollowupWithRelations(ctx.user, input.id)

  if (!target || !canEditFollowup(ctx.user, target)) {
    throw forbiddenError()
  }

  return prismaClient.$transaction(transaction =>
    updateTransaction(transaction, input, ctx, target)
  )
}

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: EditFollowupInput
) => {
  const target = await getFollowupSecurityTarget(user, input.id)
  return canEditFollowup(user, target)
}

export const updateFollowupMutation = createMutation({
  handler,
  inputValidation: editFollowupSchema,
  securityCheck
})
