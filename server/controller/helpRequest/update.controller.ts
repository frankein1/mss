import { Prisma, StructureType, UserActivityType } from '@prisma/client'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import type { EditHelpRequestInput } from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import {
  canEditHelpRequest,
  canEditHelpRequestPrivateSynthesis
} from '~/server/security/rules'
import { preparePrescribingOrganization } from '~/utils/prescribingOrganization'
import { prepareInstructorOrganization } from '~/utils/instructorOrganization'
import { prepareDocumentsMutations } from '~/utils/document/prepareDocumentMutations'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'

function getHelpRequest(id: string) {
  return prismaClient.helpRequest.findUnique({
    where: { id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      },
      documents: true
    }
  })
}

type HelpRequestWithBeneficiaryAndDocuments = Prisma.PromiseReturnType<
  typeof getHelpRequest
>

export async function prepareHelpRequestData({
  input,
  transaction,
  user,
  target
}: {
  input: EditHelpRequestInput
  transaction: Prisma.TransactionClient
  user: ProtectedAppContext['user']
  target: NonNullable<HelpRequestWithBeneficiaryAndDocuments>
}): Promise<Prisma.HelpRequestUncheckedUpdateInput> {
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
  user: ProtectedAppContext['user'],
  target: NonNullable<HelpRequestWithBeneficiaryAndDocuments>
) {
  const data = await prepareHelpRequestData({
    input,
    transaction,
    user,
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
    userId: user.id,
    activity: UserActivityType.UPDATE,
    object: 'HelpRequest',
    objectId: helpRequest.id
  })

  return { helpRequest }
}

export const updateHelpRequestHandler = async ({
  input,
  ctx: { user }
}: {
  input: EditHelpRequestInput
  ctx: ProtectedAppContext
}) => {
  const target = await getHelpRequest(input.id)

  if (!target || !canEditHelpRequest(user, target)) {
    throw forbiddenError()
  }

  return prismaClient.$transaction(transaction =>
    updateTransaction(transaction, input, user, target)
  )
}
