import {
  Beneficiary,
  Comment,
  Document,
  FileInstruction,
  Followup,
  FollowupType,
  HelpRequest,
  HousingHelpRequest,
  InstructorOrganization,
  NotificationType,
  PrescribingOrganization,
  SocialSupport,
  User
} from '@prisma/client'
import { SecurityRuleContext, SecurityRuleGrantee } from '../security'
import { isNewOption, newOptionToLabel } from '~/utils/options'
import { connect } from '~/utils/prisma'

export function prepareInstructorOrganization(
  instructorOrganizationId: string | null | undefined,
  ctx: SecurityRuleContext,
  isExternalStructure: boolean,
  hasInstructorOrganizationAlreadySelected = false
) {
  if (!isExternalStructure) {
    return undefined
  }
  if (!instructorOrganizationId) {
    return hasInstructorOrganizationAlreadySelected
      ? { disconnect: true }
      : undefined
  }
  if (isNewOption(instructorOrganizationId)) {
    return {
      create: {
        name: newOptionToLabel(instructorOrganizationId),
        structureId: ctx.structure.id,
        createdById: ctx.user.id
      }
    }
  }
  return connect(instructorOrganizationId)
}

export function prepareNewHistoryElementNotification(
  beneficiary: Pick<Beneficiary, 'id'> & { referents: { id: string }[] },
  user: SecurityRuleGrantee
) {
  return {
    createMany: {
      data: beneficiary.referents
        .filter(referent => referent.id !== user.id)
        .map(referent => ({
          beneficiaryId: beneficiary.id,
          recipientId: referent.id,
          type: NotificationType.NewHistoryElement,
          itemCreatedById: user.id
        }))
    }
  }
}

function show<T>(val: T, condition: boolean): T | null {
  return condition ? val : null
}

export function filterSocialSupport({
  socialSupport,
  conditions
}: {
  socialSupport: SocialSupport & {
    beneficiary: Beneficiary
    createdBy: User
    types: FollowupType[]
    documents?: Document[]
    comments?: (Comment & { createdBy: User })[]
  }
  conditions: {
    details: boolean
    minister: boolean
    privateSynthesis: boolean
  }
}) {
  return {
    id: socialSupport.id,
    socialSupportType: socialSupport.socialSupportType,
    date: socialSupport.date,
    structureId: socialSupport.structureId,
    created: socialSupport.created,
    createdBy: socialSupport.createdBy,
    createdById: socialSupport.createdById,
    updated: socialSupport.updated,
    status: socialSupport.status,
    types: socialSupport.types,

    beneficiary: socialSupport.beneficiary,
    beneficiaryId: socialSupport.beneficiaryId,

    dueDate: show(socialSupport.dueDate, conditions.details),

    privateSynthesis: show(
      socialSupport.privateSynthesis,
      conditions.privateSynthesis
    ),

    synthesis: show(socialSupport.synthesis, conditions.details),

    documents: show(socialSupport.documents, conditions.details),
    comments: show(socialSupport.comments, conditions.details),

    ministre: show(socialSupport.ministre, conditions.minister),
    numeroPegase: show(socialSupport.numeroPegase, conditions.minister)
  }
}

export function filterFollowup({
  followup,
  conditions
}: {
  followup: Followup & {
    prescribingOrganization: Partial<PrescribingOrganization> | null
  }
  conditions: {
    details: boolean
    minister: boolean
    privateSynthesis: boolean
  }
}) {
  return {
    // HEADER
    id: followup.id,
    structureName: followup.structureName,
    redirected: followup.redirected,
    medium: followup.medium,
    // MINISTERE
    classified: show(followup.classified, conditions.minister),
    forwardedToJustice: show(followup.forwardedToJustice, conditions.minister),
    // DETAILS
    prescribingOrganization: show(
      followup.prescribingOrganization,
      conditions.details
    ),
    firstFollowup: show(followup.firstFollowup, conditions.details),
    helpRequested: show(followup.helpRequested, conditions.details),
    thirdPersonName: show(followup.thirdPersonName, conditions.details),
    place: show(followup.place, conditions.details)
  }
}
export function filterFileInstruction({
  fileInstruction,
  conditions
}: {
  fileInstruction: FileInstruction & {
    instructorOrganization: Partial<InstructorOrganization> | null
    helpRequest: HelpRequest & {
      prescribingOrganization: Partial<PrescribingOrganization> | null
    } | null
    housingHelpRequest?: HousingHelpRequest | null
  }
  conditions: {
    details: boolean
    minister: boolean
    privateSynthesis: boolean
  }
}) {
  const { details } = conditions
  const { helpRequest, housingHelpRequest } = fileInstruction

  return {
    id: fileInstruction.id,
    type: fileInstruction.type,
    fullFile: fileInstruction.fullFile,
    decisionDate: show(fileInstruction.decisionDate, details),
    dispatchDate: show(fileInstruction.dispatchDate, details),

    examinationDate: show(fileInstruction.examinationDate, details),
    externalStructure: show(fileInstruction.externalStructure, details),
    instructorOrganizationId: show(
      fileInstruction.instructorOrganizationId,
      details
    ),

    reason: show(fileInstruction.reason, details),

    refusalReason: show(fileInstruction.refusalReason, details),
    refusalReasonOther: show(fileInstruction.refusalReasonOther, details),

    instructorOrganization: show(
      fileInstruction.instructorOrganization,
      details
    ),
    helpRequest: helpRequest
      ? filterHelpRequest({ helpRequest, conditions })
      : null,
    housingHelpRequest: housingHelpRequest
      ? filterHousingHelpRequest({ housingHelpRequest, conditions })
      : null
  }
}

export function filterHousingHelpRequest({
  housingHelpRequest,
  conditions
}: {
  housingHelpRequest: HousingHelpRequest
  conditions: {
    details: boolean
    minister: boolean
    privateSynthesis: boolean
  }
}) {
  const { details } = conditions
  return {
    id: housingHelpRequest.id,

    isFirst: show(housingHelpRequest.isFirst, details),
    firstOpeningDate: show(housingHelpRequest.firstOpeningDate, details),
    askedHousing: show(housingHelpRequest.askedHousing, details),
    uniqueId: show(housingHelpRequest.uniqueId, details),
    taxHouseholdAdditionalInformation: show(
      housingHelpRequest.taxHouseholdAdditionalInformation,
      details
    ),
    maxRent: show(housingHelpRequest.maxRent, details),
    maxCharges: show(housingHelpRequest.maxCharges, details),
    housingType: show(housingHelpRequest.housingType, details),
    roomCount: show(housingHelpRequest.roomCount, details),
    isPmr: show(housingHelpRequest.isPmr, details)
  }
}

export function filterHelpRequest({
  helpRequest,
  conditions
}: {
  helpRequest: HelpRequest & {
    prescribingOrganization: Partial<PrescribingOrganization> | null
  }
  conditions: {
    details: boolean
    minister: boolean
    privateSynthesis: boolean
  }
}) {
  const { details } = conditions
  return {
    id: helpRequest?.id,
    financialSupport: helpRequest.financialSupport,

    allocatedAmount: show(helpRequest.allocatedAmount, details),
    askedAmount: show(helpRequest.askedAmount, details),
    isRefundable: show(helpRequest.isRefundable, details),

    handlingDate: show(helpRequest.handlingDate, details),

    paymentDate: show(helpRequest.paymentDate, details),
    paymentMethod: show(helpRequest.paymentMethod, details),
    prescribingOrganizationId: show(
      helpRequest.prescribingOrganizationId,
      details
    ),

    prescribingOrganization: show(helpRequest.prescribingOrganization, details)
  }
}
