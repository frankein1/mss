import type { User } from '@prisma/client'
import { HelpRequestWithRelations } from '~/server/query/helpRequests'
import {
  canViewHelpRequestDetails,
  canViewHelpRequestPrivateSynthesis
} from '~/server/security/rules'

export function getHelpRequestAccessibleData(
  user: User,
  helpRequest: NonNullable<HelpRequestWithRelations>
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

function getHelpRequestMeta(
  helpRequest: NonNullable<HelpRequestWithRelations>
) {
  return {
    id: helpRequest.id,
    structureId: helpRequest.structureId,
    created: helpRequest.created,
    createdBy: helpRequest.createdBy,
    createdById: helpRequest.createdById,
    updated: helpRequest.updated,
    openingDate: helpRequest.openingDate,
    fullFile: helpRequest.fullFile,
    status: helpRequest.status,
    typeId: helpRequest.typeId,
    type: helpRequest.type,
    beneficiary: helpRequest.beneficiary,
    beneficiaryId: helpRequest.beneficiaryId
  }
}

function getHelpRequestDetails(
  user: User,
  helpRequest: NonNullable<HelpRequestWithRelations>
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
    instructorOrganization: helpRequest.instructorOrganization,
    ministre: helpRequest.ministre,
    numeroPegase: helpRequest.numeroPegase,
    paymentDate: helpRequest.paymentDate,
    paymentMethod: helpRequest.paymentMethod,
    prescribingOrganizationId: helpRequest.prescribingOrganizationId,
    prescribingOrganization: helpRequest.prescribingOrganization,
    reason: helpRequest.reason,
    refusalReason: helpRequest.refusalReason,
    synthesis: helpRequest.synthesis
  }
}

function getHelpRequestPrivateSynthesis(
  user: User,
  helpRequest: NonNullable<HelpRequestWithRelations>
) {
  if (!canViewHelpRequestPrivateSynthesis(user, helpRequest)) {
    return {}
  }

  return {
    privateSynthesis: helpRequest.privateSynthesis
  }
}
