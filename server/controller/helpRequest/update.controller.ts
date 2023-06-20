import {
  Prisma,
  User,
  HelpRequest,
  Beneficiary,
  Document,
  StructureType
} from '@prisma/client'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import type { EditHelpRequestInput } from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import {
  canEditBeneficiaryHelpRequest,
  canEditBeneficiaryHelpRequestPrivateSynthesis
} from '~/server/security/rules'
import { preparePrescribingOrganization } from '~/utils/prescribingOrganization/preparePrescribingOrganization'
import { prepareInstructorOrganization } from '~/utils/instructorOrganization/prepareInstructorOrganization'
import { prepareDocumentsMutations } from '~/utils/document/prepareDocumentMutations'

export async function prepareHelpRequestData({
  input,
  transaction,
  user,
  target
}: {
  input: EditHelpRequestInput
  transaction: Prisma.TransactionClient
  user: User
  target: HelpRequest & {
    beneficiary: Beneficiary & {
      referents: User[]
    }
    documents: Document[]
  }
}): Promise<Prisma.HelpRequestUncheckedUpdateInput> {
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
    documents: prepareDocumentsMutations(input.documents, target.documents),
    financialSupport: input.financialSupport === 'true',
    externalStructure: input.externalStructure === 'true',
    prescribingOrganizationId,
    instructorOrganizationId,
    privateSynthesis: canEditBeneficiaryHelpRequestPrivateSynthesis(
      user,
      target
    )
      ? input.privateSynthesis
      : undefined,
    ...ministryData
  }
}

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

async function updateTransaction(
  transaction: Prisma.TransactionClient,
  input: EditHelpRequestInput,
  user: User,
  target: Exclude<HelpRequestWithBeneficiaryAndDocuments, null>
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

  if (
    !target ||
    !canEditBeneficiaryHelpRequest(user, target.beneficiary, target)
  ) {
    throw forbiddenError()
  }

  return prismaClient.$transaction(transaction =>
    updateTransaction(transaction, input, user, target)
  )
}
