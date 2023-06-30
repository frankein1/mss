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
  user
}: {
  input: CreateHelpRequestInput
  transaction: Prisma.TransactionClient
  user: ProtectedAppContext['user']
}): Promise<Prisma.HelpRequestUncheckedCreateInput> {
  const { type } = await transaction.structure.findUniqueOrThrow({
    where: { id: user.structureId },
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
    structureId: user.structureId,
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
  user: ProtectedAppContext['user']
) => {
  const data = await prepareHelpRequestData({ input, transaction, user })

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
    userId: user.id,
    activity: UserActivityType.CREATE,
    object: 'HelpRequest',
    objectId: helpRequest.id
  })

  return { helpRequest }
}

export const addHelpRequestHandler = async ({
  input,
  ctx: { user }
}: {
  input: CreateHelpRequestInput
  ctx: ProtectedAppContext
}) => {
  const target = await getBeneficiarySecurityTarget(input.beneficiaryId)

  if (!target) {
    throw invalidError('Beneficiary not found')
  }

  if (!canCreateHelpRequest(user, target)) {
    throw forbiddenError()
  }

  return prismaClient.$transaction(transaction => {
    return createTransaction(transaction, input, user)
  })
}
