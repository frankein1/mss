import type { Prisma, User } from '@prisma/client'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import {
  canViewHelpRequest,
  canViewHelpRequestDetails,
  canViewHelpRequestPrivateSynthesis
} from '~/server/security/rules'
import { prismaClient } from '~/server/prisma'

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

type GetHelpRequestOutput = Prisma.PromiseReturnType<typeof getHelpRequest>

function getHelpRequestAccessibleData(
  user: User,
  helpRequest: NonNullable<GetHelpRequestOutput>
) {
  const meta = getHelpRequestMeta(helpRequest)
  const details = getHelpRequestDetails(user, helpRequest)
  const privateSynthesis = getHelpRequestPrivateSynthesis(user, helpRequest)

  return {
    ...meta,
    ...details,
    ...privateSynthesis
  }
}

function getHelpRequestMeta(helpRequest: NonNullable<GetHelpRequestOutput>) {
  return {
    id: helpRequest.id,
    structureId: helpRequest.structureId,
    created: helpRequest.created,
    createdById: helpRequest.createdById,
    openingDate: helpRequest.openingDate,
    fullFile: helpRequest.fullFile,
    status: helpRequest.status,
    typeId: helpRequest.typeId,
    beneficiary: helpRequest.beneficiary,
    beneficiaryId: helpRequest.beneficiaryId
  }
}

function getHelpRequestDetails(
  user: User,
  helpRequest: NonNullable<GetHelpRequestOutput>
) {
  if (!canViewHelpRequestDetails(user, helpRequest.beneficiary)) {
    return {}
  }

  return {
    allocatedAmount: helpRequest.allocatedAmount,
    askedAmount: helpRequest.askedAmount,
    decisionDate: helpRequest.decisionDate,
    dispatchDate: helpRequest.dispatchDate,
    documents: helpRequest.documents,
    dueDate: helpRequest.dueDate,
    examinationDate: helpRequest.examinationDate,
    externalStructure: helpRequest.externalStructure,
    financialSupport: helpRequest.financialSupport,
    handlingDate: helpRequest.handlingDate,
    instructorOrganizationId: helpRequest.instructorOrganizationId,
    ministre: helpRequest.ministre,
    numeroPegase: helpRequest.numeroPegase,
    paymentDate: helpRequest.paymentDate,
    paymentMethod: helpRequest.paymentMethod,
    prescribingOrganizationId: helpRequest.prescribingOrganizationId,
    reason: helpRequest.reason,
    refusalReason: helpRequest.refusalReason,
    synthesis: helpRequest.synthesis
  }
}

function getHelpRequestPrivateSynthesis(
  user: User,
  helpRequest: NonNullable<GetHelpRequestOutput>
) {
  if (!canViewHelpRequestPrivateSynthesis(user, helpRequest)) {
    return {}
  }

  return {
    privateSynthesis: helpRequest.privateSynthesis
  }
}

export const getHelpRequestDetailsHandler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const helpRequest = await getHelpRequest(id)

  if (!helpRequest || !canViewHelpRequest(user, helpRequest.beneficiary)) {
    throw forbiddenError()
  }

  const data = getHelpRequestAccessibleData(user, helpRequest)

  return data
}
