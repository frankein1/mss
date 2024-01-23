import {
  Beneficiary,
  Comment,
  Document,
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
    dueDate: boolean
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

    dueDate: show(socialSupport.dueDate, conditions.dueDate),

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
    dueDate: boolean
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
export function filterHelpRequest({
  helpRequest,
  conditions
}: {
  helpRequest: HelpRequest & {
    prescribingOrganization: Partial<PrescribingOrganization> | null
    instructorOrganization: Partial<InstructorOrganization> | null
  }
  conditions: {
    details: boolean
    minister: boolean
    privateSynthesis: boolean
    dueDate: boolean
  }
}) {
  const { details } = conditions
  return {
    id: helpRequest.id,
    fullFile: helpRequest.fullFile,
    financialSupport: helpRequest.financialSupport,

    allocatedAmount: show(helpRequest.allocatedAmount, details),
    askedAmount: show(helpRequest.askedAmount, details),
    decisionDate: show(helpRequest.decisionDate, details),
    dispatchDate: show(helpRequest.dispatchDate, details),
    isRefundable: show(helpRequest.isRefundable, details),

    examinationDate: show(helpRequest.examinationDate, details),
    externalStructure: show(helpRequest.externalStructure, details),
    handlingDate: show(helpRequest.handlingDate, details),
    instructorOrganizationId: show(
      helpRequest.instructorOrganizationId,
      details
    ),

    paymentDate: show(helpRequest.paymentDate, details),
    paymentMethod: show(helpRequest.paymentMethod, details),
    prescribingOrganizationId: show(
      helpRequest.prescribingOrganizationId,
      details
    ),

    refusalReason: show(helpRequest.refusalReason, details),
    refusalReasonOther: show(helpRequest.refusalReasonOther, details),

    prescribingOrganization: show(helpRequest.prescribingOrganization, details),
    instructorOrganization: show(helpRequest.instructorOrganization, details)
  }
}

export function filterHousingHelpRequest({
  housingHelpRequest,
  conditions
}: {
  housingHelpRequest: HousingHelpRequest & {
    instructorOrganization: Partial<InstructorOrganization> | null
  }
  conditions: {
    details: boolean
    minister: boolean
    privateSynthesis: boolean
    dueDate: boolean
  }
}) {
  const { details } = conditions
  return {
    id: housingHelpRequest.id,
    fullFile: housingHelpRequest.fullFile,

    decisionDate: show(housingHelpRequest.decisionDate, details),
    dispatchDate: show(housingHelpRequest.dispatchDate, details),

    examinationDate: show(housingHelpRequest.examinationDate, details),
    externalStructure: show(housingHelpRequest.externalStructure, details),
    instructorOrganizationId: show(
      housingHelpRequest.instructorOrganizationId,
      details
    ),

    refusalReason: show(housingHelpRequest.refusalReason, details),

    instructorOrganization: show(
      housingHelpRequest.instructorOrganization,
      details
    ),

    isFirst: show(housingHelpRequest.isFirst, details),
    firstOpeningDate: show(housingHelpRequest.firstOpeningDate, details),
    askedHousing: show(housingHelpRequest.askedHousing, details),
    reason: show(housingHelpRequest.reason, details),
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
