import { Prisma, User, StructureType } from '@prisma/client'
import { AppContext, invalidError, forbiddenError } from '~/server/trpc'
import type { CreateHelpRequestInput } from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import { canCreateBeneficiaryHelpRequest } from '~/server/security/rules'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { preparePrescribingOrganization } from '~/utils/prescribingOrganization/preparePrescribingOrganization'
import { prepareInstructorOrganization } from '~/utils/instructorOrganization/prepareInstructorOrganization'
import { prepareDocumentsMutations } from '~/utils/document/prepareDocumentMutations'

export async function prepareHelpRequestData({
  input,
  transaction,
  user
}: {
  input: CreateHelpRequestInput
  transaction: Prisma.TransactionClient
  user: User
}): Promise<Prisma.HelpRequestUncheckedCreateInput> {
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

  const ministryData =
    type === StructureType.Ministere
      ? { numeroPegase: input.numeroPegase, ministre: input.ministre }
      : {}

  const prescribingOrganizationId = await preparePrescribingOrganization(
    transaction,
    user,
    structureId,
    input.prescribingOrganizationId
  )

  const instructorOrganizationId = await prepareInstructorOrganization(
    transaction,
    user,
    structureId,
    input.instructorOrganizationId
  )

  return {
    ...input,
    structureId,
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
  user: User
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

  return { helpRequest }
}

export const addHelpRequestHandler = async ({
  input,
  ctx: { user }
}: {
  input: CreateHelpRequestInput
  ctx: AppContext
}) => {
  const target = await getBeneficiarySecurityTarget(input.beneficiaryId)

  if (!target) {
    throw invalidError('Beneficiary not found')
  }

  if (!canCreateBeneficiaryHelpRequest(user, target)) {
    throw forbiddenError()
  }

  return prismaClient.$transaction(transaction => {
    return createTransaction(transaction, input, user)
  })
}
