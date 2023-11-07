import { Prisma, FollowupMedium, UserActivityType } from '@prisma/client'
import {
  FollowupTarget,
  prepareFollowupTypesMutations,
  prepareMinistryData
} from './helper/prepareFollowupData'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { EditFollowupInput, editFollowupSchema } from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import {
  SecurityRuleGrantee,
  canEditFollowup,
  canEditFollowupPrivateSynthesis
} from '~/server/security/rules'

import { prepareDocumentsMutations } from '~/utils/document/prepareDocumentMutations'
import {
  FollowupWithRelations,
  getFollowupSecurityTarget,
  getFollowupWithRelations,
  createPrescribingOrganizationIfNecesserary
} from '~/server/query'

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
  const { type } = structure

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

  const prescribingOrganizationId =
    await createPrescribingOrganizationIfNecesserary(
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
  securityCheck,
  auditLog: {
    key: 'followup.update',
    target: 'Followup',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
