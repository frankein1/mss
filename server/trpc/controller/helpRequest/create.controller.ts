import { Prisma, StructureType, UserActivityType } from '@prisma/client'
import {
  ProtectedAppContext,
  invalidError,
  forbiddenError
} from '~/server/trpc'
import type { CreateHelpRequestInput } from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import { canCreateHelpRequest } from '~/server/security/rules'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { preparePrescribingOrganization } from '~/utils/prescribingOrganization'
import { prepareInstructorOrganization } from '~/utils/instructorOrganization'
import { prepareDocumentsMutations } from '~/utils/document/prepareDocumentMutations'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'

export async function prepareHelpRequestData({
  input,
  transaction,
  ctx
}: {
  input: CreateHelpRequestInput
  transaction: Prisma.TransactionClient
  ctx: ProtectedAppContext
}): Promise<Prisma.HelpRequestUncheckedCreateInput> {
  const { type } = await transaction.structure.findUniqueOrThrow({
    where: { id: ctx.structureId },
    select: {
      type: true
    }
  })

  const ministryData =
    type === StructureType.Ministere
      ? { numeroPegase: input.numeroPegase, ministre: input.ministre }
      : {}

  const { user } = ctx

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
    structureId: ctx.structureId,
    documents: prepareDocumentsMutations(input.documents),
    financialSupport: input.financialSupport === 'true',
    externalStructure: input.externalStructure === 'true',
    prescribingOrganizationId,
    instructorOrganizationId,
    createdById: user.id,
    ...ministryData
  }
}

const createTransaction = async (
  transaction: Prisma.TransactionClient,
  input: CreateHelpRequestInput,
  ctx: ProtectedAppContext
) => {
  const data = await prepareHelpRequestData({ input, transaction, ctx })

  const helpRequest = await transaction.helpRequest.create({
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
    object: 'HelpRequest',
    objectId: helpRequest.id
  })

  return { helpRequest }
}

export const addHelpRequestHandler = async ({
  input,
  ctx
}: {
  input: CreateHelpRequestInput
  ctx: ProtectedAppContext
}) => {
  const target = await getBeneficiarySecurityTarget(input.beneficiaryId)

  if (!target) {
    throw invalidError('Beneficiary not found')
  }

  if (!canCreateHelpRequest(ctx.user, target)) {
    throw forbiddenError()
  }

  return prismaClient.$transaction(transaction => {
    return createTransaction(transaction, input, ctx)
  })
}
