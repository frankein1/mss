import { Prisma, StructureType, UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { EditHelpRequestInput, editHelpRequestSchema } from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import {
  SecurityRuleGrantee,
  canEditHelpRequest,
  canEditHelpRequestPrivateSynthesis
} from '~/server/security/rules'
import { preparePrescribingOrganization } from '~/utils/prescribingOrganization'
import { prepareInstructorOrganization } from '~/utils/instructorOrganization'
import { prepareDocumentsMutations } from '~/utils/document/prepareDocumentMutations'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import {
  HelpRequestWithRelations,
  getHelpRequestWithRelations,
  getHelpRequestsecurityTarget
} from '~/server/query'

async function prepareHelpRequestData({
  input,
  transaction,
  ctx,
  target
}: {
  input: EditHelpRequestInput
  transaction: Prisma.TransactionClient
  ctx: ProtectedAppContext
  target: NonNullable<HelpRequestWithRelations>
}): Promise<Prisma.HelpRequestUncheckedUpdateInput> {
  const { user, structure } = ctx
  const { type } = await transaction.structure.findUniqueOrThrow({
    where: { id: structure.id },
    select: {
      type: true
    }
  })

  const ministryData =
    type === StructureType.Ministere
      ? { numeroPegase: input.numeroPegase, ministre: input.ministre }
      : {}

  const prescribingOrganizationId = await preparePrescribingOrganization(
    transaction,
    user,
    input.prescribingOrganizationId
  )

  const instructorOrganizationId = await prepareInstructorOrganization(
    transaction,
    user,
    input.instructorOrganizationId
  )

  return {
    ...input,
    documents: prepareDocumentsMutations(input.documents, target.documents),
    financialSupport: input.financialSupport === 'true',
    externalStructure: input.externalStructure === 'true',
    prescribingOrganizationId,
    instructorOrganizationId,
    privateSynthesis: canEditHelpRequestPrivateSynthesis(user, target)
      ? input.privateSynthesis
      : undefined,
    ...ministryData
  }
}

async function updateTransaction(
  transaction: Prisma.TransactionClient,
  input: EditHelpRequestInput,
  ctx: ProtectedAppContext,
  target: NonNullable<HelpRequestWithRelations>
) {
  const data = await prepareHelpRequestData({
    input,
    transaction,
    ctx,
    target
  })
  const helpRequest = await transaction.helpRequest.update({
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
    userId: ctx.user.id,
    activity: UserActivityType.UPDATE,
    object: 'HelpRequest',
    objectId: helpRequest.id
  })

  return { helpRequest }
}

const handler = async ({
  input,
  ctx
}: {
  input: EditHelpRequestInput
  ctx: ProtectedAppContext
}) => {
  const target = await getHelpRequestWithRelations(ctx.user, input.id)

  if (!target || !canEditHelpRequest(ctx.user, target)) {
    throw forbiddenError()
  }

  return prismaClient.$transaction(transaction =>
    updateTransaction(transaction, input, ctx, target)
  )
}

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: EditHelpRequestInput
) => {
  const target = await getHelpRequestsecurityTarget(user, input.id)
  return canEditHelpRequest(user, target)
}

export const updateHelpRequestMutation = createMutation({
  securityCheck,
  inputValidation: editHelpRequestSchema,
  handler
})
