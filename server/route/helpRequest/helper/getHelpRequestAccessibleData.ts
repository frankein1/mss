import { HelpRequestWithRelations } from '~/server/query/helpRequests'
import { HelpRequestPermissions } from '~/server/security'

export function getHelpRequestAccessibleData(
  permissions: HelpRequestPermissions,
  helpRequest: NonNullable<HelpRequestWithRelations>
) {
  const meta = getHelpRequestMeta(helpRequest)
  const details = getHelpRequestDetails(permissions, helpRequest)
  const privateSynthesis = getHelpRequestPrivateSynthesis(
    permissions,
    helpRequest
  )

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
    subject: helpRequest.subject,
    typeId: helpRequest.typeId,
    type: helpRequest.type,
    beneficiary: helpRequest.beneficiary,
    beneficiaryId: helpRequest.beneficiaryId
  }
}

function getHelpRequestDetails(
  permissions: HelpRequestPermissions,
  helpRequest: NonNullable<HelpRequestWithRelations>
) {
  if (!permissions.get.details) {
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
    handlingDate: helpRequest.handlingDate,
    instructorOrganizationId: helpRequest.instructorOrganizationId,
    instructorOrganization: helpRequest.instructorOrganization,
    ministre: permissions.get.ministre ? helpRequest.ministre : undefined,
    numeroPegase: permissions.get.numeroPegase
      ? helpRequest.numeroPegase
      : undefined,
    paymentDate: helpRequest.paymentDate,
    paymentMethod: helpRequest.paymentMethod,
    prescribingOrganizationId: helpRequest.prescribingOrganizationId,
    prescribingOrganization: helpRequest.prescribingOrganization,
    refusalReason: helpRequest.refusalReason,
    synthesis: helpRequest.synthesis,
    subject: helpRequest.subject,
    refusalReasonOther: helpRequest.refusalReasonOther
  }
}

function getHelpRequestPrivateSynthesis(
  permissions: HelpRequestPermissions,
  helpRequest: NonNullable<HelpRequestWithRelations>
) {
  if (!permissions.get.privateSynthesis) {
    return {}
  }

  return {
    privateSynthesis: helpRequest.privateSynthesis
  }
}
